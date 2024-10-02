const Chef = require('../models/Chef');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); // Ensure you import mongoose at the top if not already imported
const multer = require('multer');
const path = require('path');



// Secret key for JWT (store this in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'DinneAppSecret';



// Set up multer storage for cover images
const coverImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'coverImage-uploads/'); // New folder for item images
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    }
  });
  
  // File filter for image validation
  const coverImageFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
  };
  
  // Multer middleware for handling item images
  const uploadCoverImage = multer({ storage: coverImageStorage, fileFilter: coverImageFileFilter });





// Signup controller
const signUpChef = async (req, res) => {
    const { name, email, phone, landmark, address1, address2, city, state, password } = req.body;

    try {
        // Here you might want to check if the chef already exists
        const existingChef = await Chef.findOne({ email });
        if (existingChef) {
            return res.status(400).json({ message: "Chef already exists!" });
        }

        const newChef = new Chef({
            name,
            email,
            phone,
            landmark,
            address1,
            address2,
            city,
            state,
            password, // Remember to hash the password before saving
        });

        await newChef.save();
        res.status(201).json({ message: "Chef registered successfully!" });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
// Login controller
const loginChef = async (req, res) => {
    try {
        const { email, password } = req.body;

        const chef = await Chef.findOne({ email });
        if (!chef) {
            return res.status(404).json({ message: 'Chef not found' });
        }

        const isMatch = await bcrypt.compare(password, chef.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: chef._id, email: chef.email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ message: 'Error during login: ' + err.message });
    }
};

// Get all chefs
const getChefs = async (req, res) => {
    try {
        const chefs = await Chef.find();
        res.status(200).json(chefs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching chefs: ' + err.message });
    }
};

// Get a specific chef by ID
const getChefById = async (req, res) => {
    try {
        const chefId = req.params.id;
        const chef = await Chef.findById(req.params.id);
        if (!chef) return res.status(404).json({ message: 'Chef not found' });
        res.status(200).json(chef);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching chef: ' + err.message });
    }
};

// Get menu items for a specific chef (assuming you have a menu model)
const getMenuItemsForChef = async (req, res) => {
    try {
        const menuItems = await Menu.find({ chefId: req.params.id });
        res.status(200).json(menuItems);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching menu items: ' + err.message });
    }
};
// Edit chef profile (with cover image upload)
const editChefProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, cuisine, specialities } = req.body; 
        const trimmedId = id.trim();

        // Validate the trimmed ID
        if (!mongoose.Types.ObjectId.isValid(trimmedId)) {
            return res.status(400).json({ message: 'Invalid chef ID' });
        }

        const updates = req.body;

        

            // If req.file exists, add the coverImage to updates
            if (req.file) {
                updates.coverImage = req.file.filename;
            }

            // Check if specialities are being sent
            if (Array.isArray(req.body.specialities)) {
                updates.specialities = req.body.specialities; // Set specialities to the incoming array
            }

            // Update the chef profile
            const updatedChef = await Chef.findByIdAndUpdate(trimmedId, updates, { new: true });
            if (!updatedChef) {
                return res.status(404).json({ message: 'Chef not found' });
            }

            res.status(200).json({ message: 'Profile updated successfully', chef: updatedChef });
        
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ message: 'Error updating profile: ' + err.message });
    }
};




const logoutChef = (req, res) => {
    // Implement logic to clear session or JWT token on frontend
    res.status(200).json({ message: 'Logged out successfully' });
};

// Delete account controller
const deleteAccount = async (req, res) => {
    const { email, password } = req.body;

    try {
        const chef = await Chef.findOne({ email });
        if (!chef) {
            return res.status(404).json({ message: 'Chef not found' });
        }

        const isMatch = await bcrypt.compare(password, chef.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        await Chef.findByIdAndDelete(chef._id);
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = { 
    getChefs, 
    signUpChef,  // Export signup function
    loginChef,     // Export login function
    getChefById, 
    getMenuItemsForChef, 
    editChefProfile,
    logoutChef,        // Export logout function
    deleteAccount,
    uploadCoverImage
};



