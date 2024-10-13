const Cart = require('../models/cartModel');
const Shop = require('../models/shop');

const { authenticateUser } = require('../services/authentication');

// Calculate total price for cart
const calculateTotalPrice = (items, shopItems) => {
    return items.reduce((total, item) => {
        const shopItem = shopItems.find(i => i._id.toString() === item.item.toString());
        if (!shopItem || !shopItem.price) {
            console.error('Item not found or missing price for item:', item.item);
            return total; // Skip this item if it's invalid
        }
        return total + (shopItem.price * item.quantity);
    }, 0);
};


// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id; // Assume user is authenticated
        console.log('User ID:', userId); // Debugging log
        console.log('Request Body:', req.body);

        if (!userId) return res.status(400).json({ message: 'User not authenticated' });
        
        const { itemId, quantity } = req.body;

        if (!itemId || quantity <= 0) {
            return res.status(400).json({ error: 'Invalid item ID or quantity.' });
        }

        const shopItem = await Shop.findById(itemId);
        if (!shopItem || !shopItem.price) {
            return res.status(404).json({ message: 'Item not found or price missing' });
        }
        console.log('shopItem:', shopItem); // Debugging line

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [{ item: itemId, quantity }],
                totalPrice: shopItem.price * quantity
            });
        } else {
            const existingItemIndex = cart.items.findIndex(i => i.item.toString() === itemId);
            if (existingItemIndex !== -1) {
                // Update quantity if item already exists
                cart.items[existingItemIndex].quantity += quantity;
            } else {
                // Add new item to cart
                cart.items.push({ item: itemId, quantity });
            }

            // Recalculate total price
            cart.totalPrice = calculateTotalPrice(cart.items, [shopItem]);
        }

        await cart.save();
        res.status(200).json({ message: 'Item added to cart', cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding item to cart', error });
    }
};

// Get cart details
exports.getCart = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const cart = await Cart.findOne({ user: userId }).populate({
            path: 'items.item', // Populate 'item' field
            populate: {
                path: 'chef', // Assuming the 'chef' field references the Chef model
                select: 'name image' // Replace with the actual fields you want
            },
            select: 'itemname name price image', // Select required fields
           

        });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json({ cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update cart item
exports.updateCartItem = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        const userId = req.user._id || req.user.id;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(i => i.item.toString() === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        const item = await Shop.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        cart.totalPrice -= cart.items[itemIndex].quantity * item.price; // Deduct old price
        cart.items[itemIndex].quantity = quantity; // Update quantity
        cart.totalPrice += quantity * item.price; // Add new price

        await cart.save();

        res.status(200).json({ message: 'Cart updated', cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Remove item from cart
exports.removeItemFromCart = async (req, res) => {
    console.log("ItemId:", req.params.itemId); // Log itemId for verification
    try {
        const { itemId } = req.params;
    
        // Perform the deletion
        const result = await Cart.findOneAndUpdate(
          { 'items._id': itemId }, // Find the cart containing this item
          { $pull: { items: { _id: itemId } } }, // Remove the item
          { new: true }
        );
    
        if (!result) {
          return res.status(404).json({ message: 'Item not found' });
        }
    
        return res.status(200).json({ message: 'Item removed successfully', cart: result });
      } catch (error) {
        console.error('Error deleting item:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }};

