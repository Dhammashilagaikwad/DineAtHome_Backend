const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../services/authentication');
const { getChefs, addChef, getChefById, getMenuItemsForChef, signUpChef, loginChef, editChefProfile, logoutChef, deleteAccount ,uploadCoverImage,acceptPreOrder,declinePreOrder,getOrderHistory} = require('../controllers/chefController');

// Define routes
router.get('/', getChefs); // Get all chefs
//router.post('/insertchef', addChef); // Add a new chef (commented out, not used)
// Get a specific chef by ID
router.get('/:id', getChefById); 

// Get menu items for a specific chef
router.get('/:id/menu', getMenuItemsForChef); 

// Signup route
router.post('/signup', signUpChef); // Chef signup


// Login route
router.post('/login', loginChef); // Chef login

// Logout route
router.post('/logout', logoutChef); // Chef logout

// Route to delete chef account
router.delete('/delete-account', deleteAccount); // Delete account

// Route to edit chef profile, including cover image upload
router.put('/:id', 
    uploadCoverImage.fields([
        { name: 'coverImage', maxCount: 1 }, 
        { name: 'profilePhoto', maxCount: 1 }
    ]), 
    editChefProfile
);

// Route to accept a pre-order
router.put('/:id/preorder/accept',authenticateUser, acceptPreOrder); // Accept pre-order

// Route to decline a pre-order
router.put('/:id/preorder/decline', declinePreOrder); // Decline pre-order

// Route in chefRoutes.js
router.get('/:id/order-history', getOrderHistory); // Get chef's order history


module.exports = router;

