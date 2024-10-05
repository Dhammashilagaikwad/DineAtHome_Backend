const PreOrderFood = require("../models/preOrderModel");
const User = require("../models/userModel");
const Chef = require("../models/Chef");

// Get all pre-orders
const getPreOrder = async (req, res) => {
  try {
    const preOrders = await PreOrderFood.find().populate('userId chefId');
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
  const userId = req.user._id; // Assuming user ID is stored in the request object after authentication

  try {
    const preOrder = await PreOrderFood.findById(req.params.id);
    
    if (!preOrder) return res.status(404).json({ message: 'Pre-order not found' });
    if (!preOrder.userId.equals(userId)) {
      return res.status(403).json({ message: 'Not authorized to edit this pre-order' });
    }

    const { name, description, quantity, deliveryDate } = req.body;

    // Update fields only if they are provided
    if (name) preOrder.name = name;
    if (description) preOrder.description = description;
    if (quantity) preOrder.quantity = quantity;
    if (deliveryDate) preOrder.deliveryDate = deliveryDate;

    const updatedPreOrder = await preOrder.save();
    res.json({ message: "Pre-order updated successfully", updatedPreOrder });
  } catch (error) {
    res.status(400).json({ message: "Error updating pre-order: " + error.message });
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
