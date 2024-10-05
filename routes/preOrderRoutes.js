const { Router } = require("express");
const { getPreOrder, getPreOrderById,postPreOrder,editPreOrder,deletePreOrderById} = require('../controllers/preorderController');
const { authenticateUser } = require('../services/authentication');

const router = Router();
router.use(authenticateUser);

router.get('/get-preOrder', getPreOrder);
router.get('/get-preOrder/:id', getPreOrderById);
router.post('/add-preOrder', authenticateUser, postPreOrder);
router.put('/edit-preOrder/:id', editPreOrder);
// router.put('/edit-preOrder/:name', editPreOrderByDishName);
router.delete('/delete-preOrder/:id', deletePreOrderById);
// router.delete('/delete-preOrder/name', deletePreOrderByName);

module.exports = router;
 