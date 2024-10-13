const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateUser } = require('../services/authentication');

// Add item to cart (POST /cart/add)
router.post('/add', authenticateUser, cartController.addToCart);

// Get cart details (GET /cart)
router.get('/getallitems', authenticateUser, cartController.getCart);

// Update item in cart (PUT /cart/updateItem)
router.put('/updateItem', authenticateUser, cartController.updateCartItem);

router.delete('/removeItem/:itemId', authenticateUser, (req, res, next) => {
    console.log("ItemId:", req.params.itemId);
    next();
 }, cartController.removeItemFromCart);
 

module.exports = router;
