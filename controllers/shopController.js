const Shop = require('../models/shop');
const multer = require('multer');
const path = require('path');


// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/shop-uploads/'); // folder where the images will be stored
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename
    }
});

// File filter to accept only certain file types
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({ storage, fileFilter,  limits: { fileSize: 100 * 1024 * 1024 } });

// Get all shop items
const getItems = async (req, res) => {
    try {
        // Populate chef details along with shop items
        const items = await Shop.find({}).populate('chef', 'name').select('itemname price quantity unit image'); ; // Assuming 'name' is the chef's field
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get a shop item by ID
const getItemById = async (req, res) => {
    try {
        const item = await Shop.findById(req.params.id).populate('chef', 'name');
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.status(200).json(item);
    } catch (error) {
        console.error('Error fetching item by ID:', error);
        res.status(500).json({ message: error.message });
    }
};


// Add a shop item
const addItem = async (req, res) => {
    const chefId = req.params.chefId;
    const { itemname, description, price, quantity = 0, unit = '' } = req.body;
    const image = req.file ? req.file.path : ''; // Store the uploaded file path
    // Validate required fields
    if (!itemname || !description || price < 0 || quantity < 0 || !chefId) {
        return res.status(400).json({ message: 'itemname, description, price, chefId, and quantity must be valid.' });
    }

    try {
        const newItem = new Shop({
            itemname,
            description,
            price,
            image, // Set a default image if not provided
            quantity,
            unit,
            chef: chefId
        });

        const savedItem = await newItem.save();
        res.status(201).json({ message: 'Food item added successfully!', item: savedItem });
    } catch (error) {
        console.error('Error adding food item:', error);
        res.status(500).json({ message: 'Error adding food item', error: error.message });
    }
};

// Remove a shop item
const removeItem = async (req, res) => {
    try {
        const removedItem = await Shop.findByIdAndDelete(req.params.id);
        if (!removedItem) return res.status(404).json({ message: 'Item not found' });
        res.status(200).json({ message: 'Item deleted successfully', item: removedItem });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get shop items by a specific chef
const getItemByChef = async (req, res) => {
    try {
        const items = await Shop.find({ chef: req.params.chefId });
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching items by chef:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get shop item by name
const getItemByName = async (req, res) => {
    try {
        const item = await Shop.findOne({ itemname: req.params.name });
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.status(200).json(item);
    } catch (error) {
        console.error('Error fetching item by name:', error);
        res.status(500).json({ message: error.message });
    }
};

// Add a shop item by chef ID
const addItemByChefId = async (req, res) => {
    const { itemname, description, price, image, quantity = 0, unit = '' } = req.body;

    // Validate input data
    if (!itemname || !description || price < 0 || quantity < 0) {
        return res.status(400).json({ message: "Invalid input" });
    }

    try {
        const newItem = new Shop({
            chef: req.params.chefId,
            itemname,
            description,
            price,
            image: image || 'default_image_url.png', // Set a default image URL if image is null
            quantity,
            unit,
        });

        const savedItem = await newItem.save();
        res.status(201).json({ message: "Item added successfully", item: savedItem });
    } catch (error) {
        console.error('Error adding item by chef ID:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update a shop item by ID
const updateItem = async (req, res) => {
    const { itemname, description, price, image, quantity, unit } = req.body;

    try {
        const updatedItem = await Shop.findByIdAndUpdate(
            req.params.id,
            { itemname, description, price, image, quantity, unit },
            { new: true } // Return the updated document
        );

        if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
        res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getItems,
    getItemById,
    addItem,
    upload,
    removeItem,
    getItemByChef,
    getItemByName,
    addItemByChefId,
    updateItem // Export the update function
};
