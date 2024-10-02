// models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to the user
    items: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true }, // Reference to the shop item
        quantity: { type: Number, required: true, min: 1 }
    }],
    totalPrice: { type: Number, required: true, min: 0 }, // Total price of the cart
    createdAt: { type: Date, default: Date.now }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;

