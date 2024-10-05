const mongoose = require('mongoose');

const preOrderFoodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  chefId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chef',
    required: true // Ensure a chef is assigned
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  price: {
    type: Number, // Price decided by the chef
    default: null // Initially null until the chef sets it
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'], // Status of the pre-order
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PreOrderFood = mongoose.model('PreOrderFood', preOrderFoodSchema);

module.exports = PreOrderFood;
