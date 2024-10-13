const mongoose = require('mongoose');

const deliveryPersonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    mobileNumber: {
        type: String,
        required: true,
        trim: true,
        match: [/^\d{10}$/, 'Please fill a valid mobile number']
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email address']
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

const DeliveryPerson = mongoose.model('DeliveryPerson', deliveryPersonSchema);

module.exports = DeliveryPerson;
