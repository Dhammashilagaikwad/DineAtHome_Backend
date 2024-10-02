const PreOrderFood = require("../models/preOrderModel");

// Get all pre-orders
const getPreOrder = async (req, res) => {
  try {
    const preOrders = await PreOrderFood.find();
    res.json(preOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get a specific pre-order by ID
const getPreOrderById =  async (req, res) => {
  try {
    const preOrder = await PreOrderFood.findById(req.params.id);
    if (!preOrder) return res.status(404).json({ message: 'Pre-order not found' });
    res.json(preOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new pre-order
const postPreOrder = async (req, res) => {
  try {
    const { name, description, quantity, priceRange, deliveryDate } = req.body;

    // Check if priceRange exists and destructure minPrice and maxPrice from it
    if (!priceRange || typeof priceRange.minPrice !== 'number' || typeof priceRange.maxPrice !== 'number') {
      return res.status(400).json({ message: 'Price range with minPrice and maxPrice values is required.' });
    }

    const preOrder = new PreOrderFood({
      name,
      description,
      quantity,
      priceRange: {
        minPrice: priceRange.minPrice,
        maxPrice: priceRange.maxPrice
      },
      deliveryDate
    });
    console.log('Min Price:', priceRange.minPrice);
console.log('Max Price:', priceRange.maxPrice);


    const newPreOrder = await preOrder.save();
    res.status(201).json(newPreOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



// Update a pre-order by ID
const editPreOrder = async (req, res) => {
  try {
    const { name, description, quantity, priceRange, deliveryDate } = req.body;
    const preOrder = await PreOrderFood.findById(req.params.id);
    
    if (!preOrder) return res.status(404).json({ message: 'Pre-order not found' });

    // Update fields only if they are provided
    if (name) preOrder.name = name;
    if (description) preOrder.description = description;
    if (quantity) preOrder.quantity = quantity;
    if (priceRange) {
      preOrder.priceRange.min = priceRange.min;
      preOrder.priceRange.max = priceRange.max;
    }
    if (deliveryDate) preOrder.deliveryDate = deliveryDate;

    const updatedPreOrder = await preOrder.save();
    res.json(updatedPreOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



// const editPreOrderByDishName = async (req, res) => {
//   try {
//     const { name, description, quantity, priceRange, deliveryDate } = req.body;
//     const { dishName } = req.params;
//     const userId = req.user._id; // Assuming user ID is stored in the request object after authentication

//     // Find the pre-order based on dish name and user ID
//     const preOrder = await PreOrderFood.findOne({ name: dishName, user: userId });

//     if (!preOrder) {
//       return res.status(404).json({ message: 'Pre-order not found or not authorized to update' });
//     }

//     // Update fields only if they are provided
//     if (name) preOrder.name = name;
//     if (description) preOrder.description = description;
//     if (quantity) preOrder.quantity = quantity;
//     if (priceRange) {
//       preOrder.priceRange.min = priceRange.min;
//       preOrder.priceRange.max = priceRange.max;
//     }
//     if (deliveryDate) preOrder.deliveryDate = deliveryDate;

//     const updatedPreOrder = await preOrder.save();
//     res.json(updatedPreOrder);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };



// Delete a pre-order by ID
const deletePreOrderById = async (req, res) => {
  try {
    const preOrder = await PreOrderFood.findByIdAndDelete(req.params.id);
    
    if (!preOrder) return res.status(404).json({ message: 'Pre-order not found' });

    res.json({ message: 'Pre-order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete a pre-order by dish name
const deletePreOrderByName = async (req, res) => {
  try {
    const dishName = req.params.dishName;
    
    // Check if the dishName is received correctly
    console.log('Dish Name:', dishName);

    const preOrder = await PreOrderFood.findOneAndDelete({ name: dishName });

    if (!preOrder) {
      return res.status(404).json({ message: 'Pre-order not found' });
    }

    res.json({ message: 'Pre-order deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
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
