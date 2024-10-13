const { Router } = require("express");
const router = Router();
const { 
  getAllItem, 
  getItemById, 
  postItem, 
  editItem, 
  deleteItemById, 
  uploadItemImage,
  addItemByChef,
  getItemsByChefId 
} = require('../controllers/addItemController');

// Routes
router.get('/getAllItem', getAllItem);
router.get('/getItem/:id', getItemById);
router.post('/', postItem); // Post item without chef association
router.put('/edit-item/:id', uploadItemImage.single('foodPhoto'), editItem);
router.delete('/deleteItem/:id', deleteItemById);
router.post('/:chefId', uploadItemImage.single('foodPhoto'), addItemByChef); // Post item associated with chefId
router.get('/getitembychefid/:chefId', getItemsByChefId); // GET route for items by chefId

// // New route to fetch all items
// router.get('/items', async (req, res) => {
//   try {
//     const items = await Item.find(); // Fetch all items
//     res.status(200).json(items);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching items', error });
//   }
// });


module.exports = router;
