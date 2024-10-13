const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const chefSchema = new mongoose.Schema({
    name: { type: String, required: true },
    profilename: { type: String, required: false},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePhoto: { type: String, required: false }, // Field for profile photo (Base64)
    coverImage: { type: String, required: false }, // Field for cover image (Base64)
    cuisine: [{ type: String }],
    category: { type: String, required: false },
    workTiming: { type: String, required: false },
    phone: { type: String, required: true },
    role: { type: String, required: false, default: "Chef" }, 
    specialities: [{ type: String }],
    experience: { type: Number, required: false },
    availability: { type: String, enum: ['Full-time', 'Part-time', 'On-demand'], required: false },
    address1: { type: String, required: false },
    address2: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true, default: 'Maharashtra' },
    country: { type: String, required: true, default: 'Bharat' },
    landmark: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    is_active: { type: Boolean, default: true },
    orderHistory: [{
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
        preOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'PreOrderFood' },
        status: { type: String, enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled', 'Accepted', 'Declined', 'Pre-Order'], required: true },
        date: { type: Date, default: Date.now },
        price: { type: Number, required: false }, // Track price at the time of order
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Link to the user who made the order
    }]
    
    
});

// Pre-save hook to hash the password before saving it to the database
chefSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

const Chef = mongoose.model('Chef', chefSchema);
module.exports = Chef;