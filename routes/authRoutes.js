const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Import the jwt package
const User = require("../models/userModel");
const Chef = require("../models/Chef");

const router = express.Router();

// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Check for User
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        // Generate token for user
        const token = jwt.sign({ id: user._id, role: 'user' }, 'DinneAppSecret', { expiresIn: '1h' }); // Replace 'your_jwt_secret' with your secret key
        return res.json({ role: "user", username: user.username, token }); // Include the token in the response
    }

    // Check for Chef
    const chef = await Chef.findOne({ email });
    console.log("Chef found:", chef); // Chef retrieved from database

    if (chef) {
        console.log("Checking password for chef:", email);
        const isPasswordValid = await bcrypt.compare(password, chef.password);
        console.log("Password valid:", isPasswordValid); // Log password validation result
        if (isPasswordValid) {
            // Generate token for chef
            const token = jwt.sign({ id: chef._id, role: 'chef' }, 'DinneAppSecret', { expiresIn: '1h' }); // Replace 'your_jwt_secret' with your secret key
            return res.json({ role: "chef", email: chef.email, token }); // Include the token in the response
        }
    }

    return res.status(401).json({ message: "Invalid email or password" });
});

module.exports = router;
