const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const multer = require('multer');
const upload = multer({ dest: 'shop-uploads/' }); // Temporary storage

// Add a new item
// router.post('/additems', shopController.addItem);
// Route for adding items with image upload
router.post('/additemwithimage/:chefId', shopController.upload.single('image'), shopController.addItem);

// Get all items
router.get('/items', shopController.getItems);

// Add a new item by chef ID
router.post('/additem/:chefId', shopController.addItemByChefId);

// Get an item by ID
router.get('/items/:id', shopController.getItemById);

// Get items by a specific chef
router.get('/items/chef/:chefId', shopController.getItemByChef);

// Get item by item name 
router.get('/items/name/:name', shopController.getItemByName);

router.get('/items/chef/:chefId', shopController.getItemByChef);


// Delete an item by ID
router.delete('/items/:id', shopController.removeItem);

// Update an item by ID
router.put('/updateitem/:id', shopController.updateItem); // Add this route for updating an item


module.exports = router;
