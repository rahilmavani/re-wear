const User = require('../models/User');
const Item = require('../models/Item');
const SwapRequest = require('../models/SwapRequest');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name
    };

    // If password is included, update it
    if (req.body.password) {
      fieldsToUpdate.password = req.body.password;
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's uploaded items
// @route   GET /api/users/items
// @access  Private
exports.getUserItems = async (req, res, next) => {
  try {
    const items = await Item.find({ uploader: req.user.id });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's swap history
// @route   GET /api/users/swaps
// @access  Private
exports.getUserSwaps = async (req, res, next) => {
  try {
    const swaps = await SwapRequest.find({ requester: req.user.id })
      .populate('item')
      .populate('offeredItem');

    res.status(200).json({
      success: true,
      count: swaps.length,
      data: swaps
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's received swap requests
// @route   GET /api/users/requests
// @access  Private
exports.getReceivedSwapRequests = async (req, res, next) => {
  try {
    // Find items uploaded by the user
    const userItems = await Item.find({ uploader: req.user.id });
    const itemIds = userItems.map(item => item._id);
    
    // Find swap requests for those items
    const swapRequests = await SwapRequest.find({ 
      item: { $in: itemIds },
      status: 'pending'
    })
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