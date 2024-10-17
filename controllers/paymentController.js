const Payment = require('../models/payment'); 
const crypto = require('crypto');
const razorpay = require('../config/razorpay-config');
const config = require('dotenv');
const mongoose = require('mongoose');
const MenuCart = require('../models/menuCartModel');
const Cart = require('../models/cartModel');

config.config({ path: './.env' });
console.log(process.env.RAZORPAY_API_KEY);

// Get Razorpay Key
const getKey = (req, res) => {
    return res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
};

// Create Order
const createOrder = async (req, res) => {
    const { amount, currency } = req.body;

    try {
        const options = {
            amount: Number(amount * 100), // Convert to paise
            currency: currency || 'INR',
            receipt: `receipt_${Math.random().toString(36).substring(7)}`,
            payment_capture: 1,
        };

        const order = await razorpay.orders.create(options);
        res.json({ status: true, order });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ status: false, message: 'Error creating order', error });
    }
};

// Process Payment
const processPayment = async (req, res) => {
    const userId = req.user._id || req.user.id;
  
    const { amount, orderId, paymentId, signature } = req.body;
  
    // Validate request data
    if (!userId || !amount || !orderId || !paymentId || !signature) {
      return res.status(400).json({ status: false, message: "Missing payment details." });
    }
  
    try {
      // Verify the payment signature
      const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET)
        .update(`${orderId.trim()}|${paymentId.trim()}`)
        .digest('hex');
  
      if (expectedSignature !== signature) {
        return res.status(400).json({ status: false, message: "Invalid payment signature." });
      }
  
      // Cast userId to ObjectId using `new`
      const validUserId = new mongoose.Types.ObjectId(userId);
  
      // Save payment details to the database
      const payment = new Payment({
        userId: validUserId,  // Save as ObjectId
        amount,
        currency: 'INR',
        paymentMethod: 'razorpay',
        paymentStatus: 'completed',
        transactionId: paymentId,
      });
  
      await payment.save();
      res.status(200).json({ status: true, message: "Payment successful!", transactionId: paymentId });
    } catch (error) {
      console.error('Error saving payment:', error.message || error);
      res.status(500).json({ status: false, message: "Error processing payment", error: error.message || error });
    }
  };
  

  // In your cart controller
const clearCartAfterPayment = async (req, res) => {
  try {
    console.log("requst user",req.user); // Log the user info for debugging
    const userId = req.user._id || req.user.id; // Assuming you have user authentication

    // Clear both menu and shop cart items
    await MenuCart.deleteMany({ userId });
    await Cart.deleteMany({ userId });

    res.status(200).json({ message: "Cart cleared successfully after payment" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Error clearing the cart", error });
  }
};


module.exports = { getKey, createOrder, processPayment,clearCartAfterPayment };
