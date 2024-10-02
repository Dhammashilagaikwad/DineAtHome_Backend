// models/contactModel.js
const mongoose = require('mongoose');

// Define the contact schema
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: [/\S+@\S+\.\S+/, 'Invalid email address'],
    },
    mobileNumber: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Invalid mobile number'], // Example for a 10-digit number
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Export the model

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
