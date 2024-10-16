const Razorpay = require('razorpay')
require('dotenv').config(); // Make sure to load environment variables

// console.log("Razorpay Key ID:", process.env.RAZORPAY_API_KEY);  
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

module.exports = razorpay