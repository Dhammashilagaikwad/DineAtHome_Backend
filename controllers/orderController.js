const Order = require('../models/Order');
const Payment = require('../models/payment');
const mongoose = require('mongoose');

// Create Order
const createOrder = async (req, res) => {
    const { chefId, items } = req.body;
    const userId = req.user._id || req.user.id;

    try {
        // Calculate total amount from items
        const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

        const order = new Order({
            userId: new mongoose.Types.ObjectId(userId),
            chefId: new mongoose.Types.ObjectId(chefId),
            items,
            totalAmount,
        });

        await order.save();
        res.status(201).json({ status: true, message: "Order created successfully!", order });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ status: false, message: "Error creating order", error: error.message });
    }
};

// Get Orders for User
const getOrders = async (req, res) => {
    const userId = req.user._id || req.user.id;

    try {
        const orders = await Order.find({ userId }).populate('chefId').populate('items.menuItemId');
        res.status(200).json({ status: true, orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ status: false, message: "Error fetching orders", error: error.message });
    }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;

    try {
        const order = await Order.findByIdAndUpdate(orderId, { orderStatus: status }, { new: true });

        if (!order) {
            return res.status(404).json({ status: false, message: "Order not found" });
        }

        res.status(200).json({ status: true, message: "Order status updated", order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ status: false, message: "Error updating order status", error: error.message });
    }
};

module.exports = { createOrder, getOrders, updateOrderStatus };
