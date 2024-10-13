

// config/db.js
const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoURI, {
           
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;

