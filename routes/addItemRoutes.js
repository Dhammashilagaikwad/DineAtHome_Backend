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
  getItemsByChefId // Import the new controller function
} = require('../controllers/addItemController');

// Routes
router.get('/getAllItem', getAllItem);
router.get('/getItem/:id', getItemById);
router.post('/', postItem); // Post item without chef association
router.put('/edit-item/:id',uploadItemImage.single('foodPhoto'), editItem);
router.delete('/deleteItem/:id', deleteItemById);
router.post('/:chefId', uploadItemImage.single('foodPhoto'), addItemByChef); // Post item associated with chefId
router.get('/getitembychefid/:chefId', getItemsByChefId); // GET route for items by chefId

module.exports = router;

