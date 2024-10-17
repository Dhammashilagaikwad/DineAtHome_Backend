const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    chefId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Chef' },
    items: [{ /* your item schema */ }],
    totalAmount: { type: Number, required: true },
    orderStatus: { type: String, default: 'pending' },
    paymentId: { type: String, required: true }, // Store payment ID
    paymentStatus: { type: String, required: true }, // Store payment status
    transactionId: { type: String }, // Store transaction ID
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
