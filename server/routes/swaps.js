const express = require('express');
const {
  createSwapRequest,
  getSwapRequests,
  getSwapRequest,
  updateSwapRequestStatus,
  cancelSwapRequest
} = require('../controllers/swapController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes
router.route('/')
  .get(getSwapRequests)
  .post(createSwapRequest);

router.route('/:id')
  .get(getSwapRequest)
  .put(updateSwapRequestStatus)
  .delete(cancelSwapRequest);

module.exports = router; 