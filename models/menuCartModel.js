const mongoose = require('mongoose');

const menuCartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      }
    }
  ]
});

const MenuCart = mongoose.model('MenuCart', menuCartSchema);

module.exports = MenuCart;

