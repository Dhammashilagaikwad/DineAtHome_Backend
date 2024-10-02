const mongoose = require('mongoose');

const preOrderFoodSchema = new mongoose.Schema({
  preOrderId: {
    type: String,
    unique: true, // Ensure this field is unique
    default: () => new mongoose.Types.ObjectId() // Or generate a custom ID
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
    min: 1 // minimum quantity should be 1
  },
  priceRange: {
    minPrice: {
      type: Number,
      required: true,
      min: 0 // minimum price should be 0
    },
    maxPrice: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value >= (this.minPrice || 0); // Fallback to 0 if minPrice is undefined
        },
        message: 'Max price must be greater than or equal to min price.'
      }
    }
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PreOrderFood = mongoose.model('PreOrderFood', preOrderFoodSchema);

module.exports = PreOrderFood;
