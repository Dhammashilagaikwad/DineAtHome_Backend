const { Router } = require('express');
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { authenticateUser } = require('../services/authentication'); // Assuming you have this middleware

const router = Router();

// Create Order Route
router.post('/create-order', authenticateUser, createOrder);

// Get Orders for User Route
router.get('/my-orders', authenticateUser, getOrders);

// Update Order Status Route
router.put('/update-order-status', authenticateUser, updateOrderStatus);

module.exports = router;
