const User = require('../models/User');
const Item = require('../models/Item');
const SwapRequest = require('../models/SwapRequest');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Don't allow deleting admin users
    if (user.isAdmin) {
      return res.status(400).json({ success: false, error: 'Cannot delete admin user' });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all items pending approval
// @route   GET /api/admin/items/pending
// @access  Private/Admin
exports.getPendingItems = async (req, res, next) => {
  try {
    const items = await Item.find({ isApproved: false })
      .populate('uploader', 'name email');

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject item
// @route   PUT /api/admin/items/:id
// @access  Private/Admin
exports.approveRejectItem = async (req, res, next) => {
  try {
    const { isApproved } = req.body;

    if (typeof isApproved !== 'boolean') {
      return res.status(400).json({ success: false, error: 'isApproved must be a boolean' });
    }

    const item = await Item.findByIdAndUpdate(
      req.params.id, 
      { isApproved }, 
      { new: true, runValidators: true }
    ).populate('uploader', 'name email');

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    // If item is approved, reward user with 10 points
    if (isApproved) {
      const user = await User.findById(item.uploader._id);
      if (user) {
        user.points += 10;
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all swap requests
// @route   GET /api/admin/swaps
// @access  Private/Admin
exports.getAllSwapRequests = async (req, res, next) => {
  try {
    const swapRequests = await SwapRequest.find()
      .populate('requester', 'name email')
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

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalItems = await Item.countDocuments();
    const pendingItems = await Item.countDocuments({ isApproved: false });
    const approvedItems = await Item.countDocuments({ isApproved: true });
    const availableItems = await Item.countDocuments({ isAvailable: true, isApproved: true });
    const totalSwaps = await SwapRequest.countDocuments();
    const pendingSwaps = await SwapRequest.countDocuments({ status: 'pending' });
    const completedSwaps = await SwapRequest.countDocuments({ status: 'completed' });

    res.status(200).json({
      success: true,
      data: {
        users: totalUsers,
        items: {
          total: totalItems,
          pending: pendingItems,
          approved: approvedItems,
          available: availableItems
        },
        swaps: {
          total: totalSwaps,
          pending: pendingSwaps,
          completed: completedSwaps
        }
      }
    });
  } catch (error) {
    next(error);
  }
}; 