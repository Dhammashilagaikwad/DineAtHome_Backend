const MenuCart = require('../models/menuCartModel'); // Adjust the path based on your structure
const Item = require('../models/addItemModel'); // Assuming this is the path to your item model

// Add item to menu cart
const addItemToMenuCart = async (req, res) => {
  const { itemId } = req.body;
  const userId = req.user._id || req.user.id;
  console.log(req.body);
  console.log("User ID:", userId);

  try {
    // Find the user's menu cart
    let cart = await MenuCart.findOne({ userId });

    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new MenuCart({ userId, items: [{ itemId, quantity: 1 }] });
    } else {
      // Check if item already exists in the cart
      const itemIndex = cart.items.findIndex(item => item.itemId.toString() === itemId);

      if (itemIndex > -1) {
        // If the item exists, increment its quantity
        cart.items[itemIndex].quantity += 1;
      } else {
        // If the item does not exist, add it to the cart
        cart.items.push({ itemId, quantity: 1 });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding item to menu cart', error });
  }
};

// Get user's menu cart
const getUserMenuCart = async (req, res) => {
    const userId = req.user._id || req.user.id; // Get userId from decoded token

  try {
    const cart = await MenuCart.findOne({ userId }).populate('items.itemId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu cart', error });
  }
};

// Remove item from menu cart
const removeItemFromMenuCart = async (req, res) => {
  const {  itemId } = req.body;
  const userId = req.user._id || req.user.id;

  try {
    let cart = await MenuCart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove the item from the cart
    cart.items = cart.items.filter(item => item.itemId.toString() !== itemId);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from menu cart', error });
  }
};

module.exports = {
  addItemToMenuCart,
  getUserMenuCart,
  removeItemFromMenuCart
};
