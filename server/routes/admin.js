const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getPendingItems,
  approveRejectItem,
  getAllSwapRequests,
  getDashboardStats
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and admin privileges
router.use(protect, admin);

// User routes
router.route('/users')
  .get(getUsers);

router.route('/users/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

// Item routes
router.get('/items/pending', getPendingItems);
router.put('/items/:id', approveRejectItem);

// Swap routes
router.get('/swaps', getAllSwapRequests);

// Dashboard stats
router.get('/stats', getDashboardStats);

module.exports = router; 