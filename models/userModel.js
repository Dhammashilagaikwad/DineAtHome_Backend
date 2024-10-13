const { createTokenForUser } = require('../services/authentication');
const { Schema, model} = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensure it's unique to prevent duplicates
    },

   
    email: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        
        
    },

    role:{
        type: String,
        enum : ["user", "homechef","admin"],
        default: "user",
    },
    
    password: {
        type: String,
        required: true,
    },

    // mobileNumber: {
    //     type: String,
        
    // },
    passwordResetToken: { type: String }, // Reset token
    passwordResetExpires: { type: Date }  // Token expiration
}, { timestamps: true });




userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10); // Generate salt
        this.password = await bcrypt.hash(this.password, salt); // Hash the password with the salt
        next();
    } catch (err) {
        next(err);
    }
});

// Static method for matching password and generating a token
userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error('User not found!');

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Incorrect password");

    // Generate a token for the user
    const token = createTokenForUser(user); 
    return token;
});


const User = model('User', userSchema);

module.exports = User;
