const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  getUserItems,
  getUserSwaps,
  getReceivedSwapRequests
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.get('/items', getUserItems);
router.get('/swaps', getUserSwaps);
router.get('/requests', getReceivedSwapRequests);

module.exports = router; 