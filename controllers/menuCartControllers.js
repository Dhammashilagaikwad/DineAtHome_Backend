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
    console.log('Populated Cart:', cart); // Debugging
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu cart', error });
  }
};

// Remove item from menu cart
const removeItemFromMenuCart = async (req, res) => {
  console.log("Remove item endpoint hit");
  console.log("Request body:", req.body);
 

  const { itemId } = req.body;
  const userId = req.user._id || req.user.id; // Ensure this is getting the correct user ID

  try {
    // Check if the cart exists and pull the item from the array
    const updatedCart = await MenuCart.findOneAndUpdate(
      { userId }, // Match the user's cart
      { $pull: { items: { _id: itemId } } }, // Pull the item by itemId (use _id of the item in the array)
      { new: true } // Return the updated document
    );

    // If no cart was updated, the item was not found
    if (!updatedCart) {
      return res.status(404).json({ message: 'Cart not found or item not in cart.' });
    }

    console.log("Updated Cart After Deletion:", updatedCart); // Log the updated cart
    res.status(200).json(updatedCart); // Respond with the updated cart
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while removing the item.' });
  }
};





module.exports = {
  addItemToMenuCart,
  getUserMenuCart,
  removeItemFromMenuCart
};
