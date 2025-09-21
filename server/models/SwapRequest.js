const mongoose = require('mongoose');

const SwapRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['swap', 'points'],
    required: true
  },
  // If type is swap, this is the item offered in exchange
  offeredItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  // If type is points, this is the number of points to be deducted
  pointsOffered: {
    type: Number
  },
  message: {
    type: String,
    maxlength: [200, 'Message cannot be more than 200 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

// Validate that either offeredItem or pointsOffered is provided based on type
SwapRequestSchema.pre('save', function(next) {
  if (this.type === 'swap' && !this.offeredItem) {
    throw new Error('Offered item is required for swap requests');
  }
  
  if (this.type === 'points' && !this.pointsOffered) {
    throw new Error('Points offered is required for points requests');
  }
  
  next();
});

module.exports = mongoose.model('SwapRequest', SwapRequestSchema); 