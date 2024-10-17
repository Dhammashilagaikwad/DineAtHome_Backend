const PreOrderFood = require("../models/preOrderModel");
const User = require("../models/userModel")
const Chef = require("../models/Chef");

// Get all pre-orders
const getPreOrder = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id; // Assuming you're using middleware to set req.user based on JWT
    const chefId = req.user._id || req.user.id; // Assuming the chef is also authenticated similarly

    // Check if the request is for a user or a chef
    let preOrders;

    if (req.user.role === 'user') {
      // If the request is for a user, find pre-orders by userId
      preOrders = await PreOrderFood.find({ userId })
        .populate('userId', 'username email') // Populate userId with selected fields from User
        .populate('chefId', 'name experience')
        .select('name description quantity price deliveryDate'); // Include price
    } else if (req.user.role === 'chef') {
      // If the request is for a chef, find pre-orders by chefId
      preOrders = await PreOrderFood.find({ chefId })
        .populate('userId', 'username email') // Populate userId with selected fields from User
        .populate('chefId', 'name experience')
        .select('name description quantity price deliveryDate'); // Include price
    }

    // If no pre-orders are found, return an appropriate message
    if (!preOrders || preOrders.length === 0) {
      return res.status(404).json({ message: "No pre-orders available." });
    }

    // Return the found pre-orders
    res.json(preOrders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pre-orders: " + error.message });
  }
};



// Get a specific pre-order by ID
const getPreOrderById = async (req, res) => {
  try {
    const preOrder = await PreOrderFood.findById(req.params.id).populate('userId chefId');
    if (!preOrder) return res.status(404).json({ message: 'Pre-order not found' });
    res.json(preOrder);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pre-order: " + error.message });
  }
};

// Create a new pre-order
const postPreOrder = async (req, res) => {
  const { chefId, name, description, quantity, deliveryDate } = req.body;
  const userId = req.user._id || req.user.id ; // Assuming user ID is stored in the request object after authentication

  // Validate input
  if (!chefId || !name || !description || !quantity || !deliveryDate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if the chef exists
  try {
    const chefExists = await Chef.findById(chefId);
    if (!chefExists) {
      return res.status(404).json({ message: "Chef not found" });
    }

    // Create a new pre-order
    const newPreOrder = new PreOrderFood({
      userId,
      chefId,
      name,
      description,
      quantity,
      deliveryDate,
    });

    await newPreOrder.save();
    res.status(201).json({ message: "Pre-order created successfully!", preOrder: newPreOrder });
  } catch (error) {
    console.error("Error creating pre-order:", error);
    res.status(500).json({ message: "Internal server error: " + error.message });
  }
};

// Update a pre-order by ID
const editPreOrder = async (req, res) => {
  const chefId = req.user._id || req.user.id; // Assuming the chef's ID is in the decoded token
  console.log(req.user);
  try {
    const preOrder = await PreOrderFood.findById(req.params.id);

    if (!preOrder) {
      return res.status(404).json({ message: 'Pre-order not found' });
    }

    // Ensure only the chef who received the pre-order can update it
    if (!preOrder.chefId.equals(chefId)) {
      return res.status(403).json({ message: 'Not authorized to update price for this pre-order' });
    }

    const { price } = req.body;

    if (!price || price <= 0) {
      return res.status(400).json({ message: 'Price must be a valid number greater than 0' });
    }

    preOrder.price = price;
    preOrder.status = 'accepted';

    const updatedPreOrder = await preOrder.save();
    res.json({ message: 'Pre-order accepted and price set successfully', updatedPreOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error updating pre-order: ' + error.message });
  }
};


// Delete a pre-order by ID
const deletePreOrderById = async (req, res) => {
  const userId = req.user._id; // Assuming user ID is stored in the request object after authentication

  try {
    const preOrder = await PreOrderFood.findById(req.params.id);
    
    if (!preOrder) return res.status(404).json({ message: 'Pre-order not found' });
    if (!preOrder.userId.equals(userId)) {
      return res.status(403).json({ message: 'Not authorized to delete this pre-order' });
    }

    await PreOrderFood.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pre-order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: "Error deleting pre-order: " + error.message });
  }
};

// Delete a pre-order by dish name
const deletePreOrderByName = async (req, res) => {
  const userId = req.user._id; // Assuming user ID is stored in the request object after authentication

  try {
    const dishName = req.params.dishName;

    const preOrder = await PreOrderFood.findOneAndDelete({ name: dishName, userId });

    if (!preOrder) {
      return res.status(404).json({ message: 'Pre-order not found or not authorized to delete' });
    }

    res.json({ message: 'Pre-order deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Error deleting pre-order: " + error.message });
  }
};

module.exports = {
    getPreOrder,
    getPreOrderById,
    postPreOrder,
    editPreOrder,
    // editPreOrderByDishName,
    deletePreOrderById,
    deletePreOrderByName
   
   
}
