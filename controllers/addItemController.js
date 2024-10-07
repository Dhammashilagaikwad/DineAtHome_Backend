const Item = require('../models/addItemModel');

const multer = require('multer');
const path = require('path');



// Set up multer storage for item images
const itemStorage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/item-uploads/'); // New folder for item images
  },
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  }
});

// File filter for image validation
const itemFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
      cb(null, true);
  } else {
      cb(new Error('Not an image! Please upload an image.'), false);
  }
};

// Multer middleware for handling item images
const uploadItemImage = multer({ storage: itemStorage, fileFilter: itemFileFilter });

// Get all items
// Get all items with populated chef data
const getAllItem = async (req, res) => {
  try {
    const items = await Item.find().populate('chefId', 'name'); // Populate chefId with chef's name
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error });
  }
};


// Get item by ID
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item', error });
  }
};

// Post new item without chef association
const postItem = async (req, res) => {
  const { foodPhoto, foodName, foodDescription, amount } = req.body;

  try {
    const existingItem = await Item.findOne({ foodName });
    if (existingItem) {
      return res.status(400).json({ message: 'Food already exists' });
    }

    const newItem = new Item({
      foodPhoto,
      foodName,
      foodDescription,
      amount
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding item', error });
  }
};

// Post item associated with chefId
const addItemByChef = async (req, res) => {
  console.log('Received a request to add item by chef:', req.params, req.body);
  
  const { chefId } = req.params; // Extract chefId from URL
  const { foodName, foodDescription, amount } = req.body;
  const foodPhoto = req.file ? req.file.path : null; // Store file path

  if (!foodPhoto || !foodName || !foodDescription || !amount) {
    return res.status(400).json({ message: 'All fields (including image) are required' });
  }

  try {
    // Existing item check
    const existingItem = await Item.findOne({ foodName, chefId });
    if (existingItem) {
      console.log('Item already exists for this chef:', existingItem);
      return res.status(400).json({ message: 'Food already exists for this chef' });
    }

    // Create a new item
    const newItem = new Item({
      chefId, // Associate item with chefId
      foodPhoto,
      foodName,
      foodDescription,
      amount
    });

    const savedItem = await newItem.save();
    console.log('New item saved:', savedItem);
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ message: 'Error adding item', error });
  }
};

// Get items by chefId
const getItemsByChefId = async (req, res) => {
  try {
    const chefId = req.params.chefId;
    const items = await Item.find({ chefId }); // Fetch items using chefId reference
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items by chefId:", error);
    res.status(500).json({ message: 'Error fetching items', error });
  }
};

// Edit item by ID
const editItem = async (req, res) => {
  const { foodPhoto, foodName, foodDescription, amount } = req.body;

  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { foodPhoto, foodName, foodDescription, amount },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: 'Error updating item', error });
  }
};

// Delete item by ID
const deleteItemById = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error });
  }
};

module.exports = {
  getAllItem,
  getItemById,
  postItem,
  addItemByChef,
  uploadItemImage,
  getItemsByChefId, // Export the new function
  editItem,
  deleteItemById
};
