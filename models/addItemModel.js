const mongoose = require('mongoose');


const itemSchema = new mongoose.Schema({
  chefId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chef'
  },
  foodPhoto: {
    type: String, // Store the photo as a URL or file path
    required: false
  },
  foodName: {
    type: String,
    required: false,
    trim: true
  },
  foodDescription: {
    type: String,
    required: false,
    trim: true
  },
  amount: {
    type: Number,
    required: false,
    min: 0
  }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
