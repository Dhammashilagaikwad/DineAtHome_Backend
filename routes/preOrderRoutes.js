const { Router } = require("express");
const { getPreOrder, getPreOrderById,postPreOrder,editPreOrder,deletePreOrderById} = require('../controllers/preorderController');

const router = Router();


router.get('/get-preOrder', getPreOrder);
router.get('/get-preOrder/:id', getPreOrderById);
router.post('/preOrder', postPreOrder);
router.put('/edit-preOrder/:id', editPreOrder);
// router.put('/edit-preOrder/:name', editPreOrderByDishName);
router.delete('/delete-preOrder/:id', deletePreOrderById);
// router.delete('/delete-preOrder/name', deletePreOrderByName);

module.exports = router;
