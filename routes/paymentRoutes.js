const { Router } = require('express');
const { createOrder, processPayment, getKey , clearCartAfterPayment} = require('../controllers/paymentController');
const router = Router();
const { authenticateUser } = require('../services/authentication');
// Create Order Route
router.post('/create-order', createOrder);

// Payment Success Route
router.post('/process-payment', authenticateUser,processPayment);

// Payment Key Route
router.route('/getkey').get(getKey);

router.post('/clear-cart', authenticateUser, clearCartAfterPayment);


module.exports = router;
