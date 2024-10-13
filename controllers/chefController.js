const Chef = require('../models/Chef');
const PreOrderFood = require('../models/preOrderModel')
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
        cb(null, 'public/coverImage-uploads/'); // New folder for item images
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



// Set up multer storage for profile photos
const profilePhotoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/profilephoto/'); // Store in public/profilephoto folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Multer middleware for handling profile photo upload
const uploadProfilePhoto = multer({
    storage: profilePhotoStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload an image.'), false);
        }
    }
});




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
        const { name, cuisine, specialities, address1, workTiming, category } = req.body; // Add address1 to the destructuring
        const trimmedId = id.trim();

        // Validate the trimmed ID
        if (!mongoose.Types.ObjectId.isValid(trimmedId)) {
            return res.status(400).json({ message: 'Invalid chef ID' });
        }

        const updates = {};

         // If req.file exists, add the coverImage to updates
         if (req.files && req.files.coverImage) {
            updates.coverImage = req.files.coverImage[0].filename; // Store cover image filename
        }


           // Check if profilePhoto was uploaded
           if (req.files && req.files.profilePhoto) {
            updates.profilePhoto = req.files.profilePhoto[0].filename; // Save profile photo filename
        }

        if (name) updates.name = name;

 // Update cuisine if it's provided
 if (cuisine) {
    updates.cuisine = cuisine; // Add cuisine to updates
}

        // Check if specialities are being sent
        if (Array.isArray(specialities)) {
            updates.specialities = specialities; // Set specialities to the incoming array
        }

        // Update address1 if it's provided
        if (address1) {
            updates.address1 = address1;
        }

  // Update workTiming if it's provided
  if (workTiming) {
    updates.workTiming = workTiming;
}

// Update category if it's provided
if (category) {
    updates.category = category;
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


// Handle pre-order acceptance by chef
const acceptPreOrder = async (req, res) => {
    const chefId = req.user._id || req.user.id;  // Assuming the chef's ID is in the token
    const preOrderId = req.params.id;  // Extract the pre-order ID from URL parameters
    const { price } = req.body;  // Extract price from the request body

    try {
        // Find the pre-order by ID
        const preOrder = await PreOrderFood.findById(preOrderId);

        if (!preOrder) {
            return res.status(404).json({ message: "Pre-order not found" });  // Handle pre-order not found
        }

        // Ensure only the chef who received the pre-order can accept it
        if (!preOrder.chefId.equals(chefId)) {
            return res.status(403).json({ message: "Not authorized to accept this pre-order" });
        }

        // Validate price
        if (!price || price <= 0) {
            return res.status(400).json({ message: 'Price must be a valid number greater than 0' });
        }

        // Update pre-order status and price
        preOrder.price = price;
        preOrder.status = "accepted";

        // Save the updated pre-order
        await preOrder.save();

        res.status(200).json({ message: "Pre-order accepted and price set successfully", preOrder });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error accepting pre-order" });
    }
};


// Handle pre-order rejection by chef
const declinePreOrder = async (req, res) => {
    const { chefId } = req.params;
    const { preOrderId, price } = req.body;

    try {
        // Find the chef
        const chef = await Chef.findById(chefId);
        if (!chef) {
            return res.status(404).json({ message: 'Chef not found' });
        }

        // Find the pre-order inside the chef's order history
        const preOrder = chef.orderHistory.find(order => order.preOrderId.toString() === preOrderId);
        if (!preOrder) {
            return res.status(404).json({ message: 'Pre-order not found' });
        }

        // Update pre-order status to declined (if necessary)
        preOrder.status = 'declined';
        preOrder.price = price;

        // Save the updated chef document
        await chef.save();

        res.status(200).json({ message: 'Pre-order declined successfully', preOrder });
    } catch (err) {
        res.status(500).json({ message: 'Error declining pre-order: ' + err.message });
    }
};


const logoutChef = (req, res) => {
    // Implement logic to clear session or JWT token on frontend
    res.status(200).json({ message: 'Logged out successfully' });
};

const updateStatus = async (req, res) => {
    const { chefId } = req.params; // Extract chefId from request params
    const { isActive } = req.body; // Expecting { isActive: true/false }

    try {
        const chef = await Chef.findByIdAndUpdate(
            chefId,
            { is_active: isActive }, // Ensure this matches your Mongoose schema
            { new: true }
        );

        if (!chef) {
            return res.status(404).json({ message: 'Chef not found' });
        }

        res.status(200).json({ message: 'Status updated successfully', chef });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Server error' });
    }
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

// Get order history for a specific chef
const getOrderHistory = async (req, res) => {
    try {
        const chefId = req.params.id;
        const chef = await Chef.findById(chefId).populate('orderHistory.preOrderId').populate('orderHistory.customerId');

        if (!chef) return res.status(404).json({ message: 'Chef not found' });

        res.status(200).json(chef.orderHistory);  // Ensure that this includes the preOrderId.quantity
    } catch (err) {
        res.status(500).json({ message: 'Error fetching order history: ' + err.message });
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
    acceptPreOrder,
    updateStatus,
    declinePreOrder,
    getOrderHistory,
    uploadCoverImage,
    uploadProfilePhoto
};



