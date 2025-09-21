const SwapRequest = require('../models/SwapRequest');
const Item = require('../models/Item');
const User = require('../models/User');

// @desc    Create swap request
// @route   POST /api/swaps
// @access  Private
exports.createSwapRequest = async (req, res, next) => {
  try {
    // Add requester to body
    req.body.requester = req.user.id;

    // Check if item exists and is available
    const item = await Item.findById(req.body.item);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    if (!item.isAvailable || !item.isApproved) {
      return res.status(400).json({ success: false, error: 'Item is not available for swap' });
    }

    // Check if the user is trying to swap their own item
    if (item.uploader.toString() === req.user.id) {
      return res.status(400).json({ success: false, error: 'You cannot request your own item' });
    }

    // If swap type is 'swap', check if offered item exists and belongs to requester
    if (req.body.type === 'swap' && req.body.offeredItem) {
      const offeredItem = await Item.findById(req.body.offeredItem);
      
      if (!offeredItem) {
        return res.status(404).json({ success: false, error: 'Offered item not found' });
      }

      if (offeredItem.uploader.toString() !== req.user.id) {
        return res.status(401).json({ success: false, error: 'You can only offer your own items' });
      }

      if (!offeredItem.isAvailable || !offeredItem.isApproved) {
        return res.status(400).json({ success: false, error: 'Offered item is not available for swap' });
      }
    }

    // If swap type is 'points', check if user has enough points
    if (req.body.type === 'points') {
      const user = await User.findById(req.user.id);
      
      if (user.points < item.pointValue) {
        return res.status(400).json({ 
          success: false, 
          error: `Not enough points. You have ${user.points} points, but need ${item.pointValue}` 
        });
      }

      // Set points offered to item point value
      req.body.pointsOffered = item.pointValue;
    }

    // Create swap request
    const swapRequest = await SwapRequest.create(req.body);

    res.status(201).json({
      success: true,
      data: swapRequest
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all swap requests
// @route   GET /api/swaps
// @access  Private
exports.getSwapRequests = async (req, res, next) => {
  try {
    // Get swap requests where user is requester
    const swapRequests = await SwapRequest.find({ requester: req.user.id })
      .populate('item')
      .populate('offeredItem');

    res.status(200).json({
      success: true,
      count: swapRequests.length,
      data: swapRequests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single swap request
// @route   GET /api/swaps/:id
// @access  Private
exports.getSwapRequest = async (req, res, next) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id)
      .populate('item')
      .populate('offeredItem')
      .populate('requester', 'name email');

    if (!swapRequest) {
      return res.status(404).json({ success: false, error: 'Swap request not found' });
    }

    // Check if user is requester or item owner
    const item = await Item.findById(swapRequest.item);
    
    if (swapRequest.requester._id.toString() !== req.user.id && 
        item.uploader.toString() !== req.user.id && 
        !req.user.isAdmin) {
      return res.status(401).json({ success: false, error: 'Not authorized to view this swap request' });
    }

    res.status(200).json({
      success: true,
      data: swapRequest
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update swap request status
// @route   PUT /api/swaps/:id
// @access  Private
exports.updateSwapRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    let swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({ success: false, error: 'Swap request not found' });
    }

    // Get the item
    const item = await Item.findById(swapRequest.item);
    
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    // Check if user is item owner
    if (item.uploader.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ success: false, error: 'Not authorized to update this swap request' });
    }

    // Handle status change logic
    if (status === 'approved') {
      // === Handle approval ===

      // Prevent double-processing if already approved previously
      if (swapRequest.status !== 'pending') {
        return res.status(400).json({ success: false, error: `Cannot approve a swap request with status: ${swapRequest.status}` });
      }

      // Common references
      const requester = await User.findById(swapRequest.requester);
      const itemOwner = await User.findById(item.uploader);

      if (!requester || !itemOwner) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      if (swapRequest.type === 'points') {
        // --- Points redemption flow ---
        if (requester.points < item.pointValue) {
          return res.status(400).json({ success: false, error: `Not enough points. User has ${requester.points} points, but needs ${item.pointValue}` });
        }

        // Deduct points from requester and credit owner
        requester.points -= item.pointValue;
        itemOwner.points += item.pointValue + 10; // reward 10 pts for successful swap
        await requester.save();
        await itemOwner.save();

        // Transfer item ownership to requester
        item.uploader = requester._id;
        item.isAvailable = true;
        await item.save();
      } else if (swapRequest.type === 'swap' && swapRequest.offeredItem) {
        // --- Direct item swap flow ---
        const offeredItem = await Item.findById(swapRequest.offeredItem);
        if (!offeredItem) {
          return res.status(404).json({ success: false, error: 'Offered item not found' });
        }

        const offeredItemOwner = await User.findById(offeredItem.uploader);
        if (!offeredItemOwner) {
          return res.status(404).json({ success: false, error: 'Offered item owner not found' });
        }

        // Swap the uploader fields
        item.uploader = offeredItemOwner._id;
        offeredItem.uploader = itemOwner._id;
        
        // Make both items available to their new owners
        item.isAvailable = true;
        offeredItem.isAvailable = true;

        await item.save();
        await offeredItem.save();

        // Reward both users with 10 points
        requester.points += 10;
        itemOwner.points += 10;
        await requester.save();
        await itemOwner.save();
      }

      // Mark item(s) as unavailable for the previous owner to prevent duplicates
      // (already handled by ownership change and availability flags)

    } else if (status === 'completed') {
      // Only allow completing already approved requests
      if (swapRequest.status !== 'approved') {
        return res.status(400).json({ 
          success: false, 
          error: 'Can only complete approved swap requests' 
        });
      }

      // If swap type is 'points', transfer points from requester to item owner
      if (swapRequest.type === 'points' && swapRequest.pointsOffered) {
        const requester = await User.findById(swapRequest.requester);
        const itemOwner = await User.findById(item.uploader);

        if (requester && itemOwner) {
          // Check if requester has enough points
          if (requester.points < swapRequest.pointsOffered) {
            return res.status(400).json({ 
              success: false, 
              error: `Not enough points. User has ${requester.points} points, but needs ${swapRequest.pointsOffered}` 
            });
          }

          // Deduct points from requester
          requester.points -= swapRequest.pointsOffered;
          await requester.save();

          // Add points to item owner
          itemOwner.points += swapRequest.pointsOffered;
          await itemOwner.save();
          
          // Transfer item ownership and make it available to the new owner
          item.uploader = swapRequest.requester;
          item.isAvailable = true;  // Make it available to the new owner
          await item.save();
        }
      } else if (swapRequest.type === 'swap' && swapRequest.offeredItem) {
        // For swap type, transfer ownership of both items
        const offeredItem = await Item.findById(swapRequest.offeredItem);
        
        if (offeredItem) {
          // Get original owners
          const itemOwner = item.uploader;
          const offeredItemOwner = offeredItem.uploader;
          
          // Swap ownership and make items available to new owners
          item.uploader = offeredItemOwner;
          item.isAvailable = true;  // Make it available to the new owner
          
          offeredItem.uploader = itemOwner;
          offeredItem.isAvailable = true;  // Make it available to the new owner
          
          // Save both items
          await item.save();
          await offeredItem.save();
          
          // Reward both users with 10 points for completed swap
          const requester = await User.findById(swapRequest.requester);
          const owner = await User.findById(itemOwner);
          
          if (requester && owner) {
            requester.points += 10;
            owner.points += 10;
            await requester.save();
            await owner.save();
          }
        }
      }

      // Set completed date
      swapRequest.completedAt = Date.now();
    } else if (status === 'rejected') {
      // If the request was previously approved, make items available again
      if (swapRequest.status === 'approved') {
        // Make item available again
        item.isAvailable = true;
        await item.save();

        // If swap type is 'swap', make offered item available again
        if (swapRequest.type === 'swap' && swapRequest.offeredItem) {
          const offeredItem = await Item.findById(swapRequest.offeredItem);
          if (offeredItem) {
            offeredItem.isAvailable = true;
            await offeredItem.save();
          }
        }
      }
    }

    // Update swap request status
    swapRequest.status = status;
    await swapRequest.save();

    res.status(200).json({
      success: true,
      data: swapRequest
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel swap request (by requester)
// @route   DELETE /api/swaps/:id
// @access  Private
exports.cancelSwapRequest = async (req, res, next) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({ success: false, error: 'Swap request not found' });
    }

    // Check if user is requester
    if (swapRequest.requester.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ success: false, error: 'Not authorized to cancel this swap request' });
    }

    // Only allow canceling pending requests
    if (swapRequest.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        error: `Cannot cancel a swap request with status: ${swapRequest.status}` 
      });
    }

    await swapRequest.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
}; 