const { Router } = require("express");
const router = Router();
const { authenticateUser } = require('../services/authentication'); 
const { 
    addItemToMenuCart, 
    getUserMenuCart, 
    removeItemFromMenuCart 
} = require('../controllers/menuCartControllers'); // Adjust the path based on your structure

// Routes
router.post('/addToMenuCart', authenticateUser, addItemToMenuCart);
router.get('/userMenuCart/:userId', authenticateUser,  getUserMenuCart);
router.delete('/removeFromMenuCart', authenticateUser, removeItemFromMenuCart);

module.exports = router;
