const express = require('express');
const router = express.Router();

const { getChefs, addChef, getChefById, getMenuItemsForChef, signUpChef, loginChef, editChefProfile, logoutChef, deleteAccount ,uploadCoverImage} = require('../controllers/chefController');

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
router.put('/:id', uploadCoverImage.single('coverImage'),editChefProfile);

module.exports = router;

