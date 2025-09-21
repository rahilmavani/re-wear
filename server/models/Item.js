const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Men', 'Women', 'Kids', 'Unisex', 'Accessories']
  },
  type: {
    type: String,
    required: [true, 'Please specify the type of clothing'],
    enum: ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Footwear', 'Accessories', 'Other']
  },
  size: {
    type: String,
    required: [true, 'Please specify the size'],
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size', 'Other']
  },
  condition: {
    type: String,
    required: [true, 'Please specify the condition'],
    enum: ['New with tags', 'Like new', 'Good', 'Fair', 'Poor']
  },
  tags: {
    type: [String],
    default: []
  },
  images: {
    type: [String],
    required: [true, 'Please add at least one image']
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  pointValue: {
    type: Number,
    default: 10,
    min: [1, 'Point value must be at least 1']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for search
ItemSchema.index({ 
  title: 'text', 
  description: 'text',
  tags: 'text'
});

module.exports = mongoose.model('Item', ItemSchema); 