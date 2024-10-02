const express = require('express');
const router = express.Router();
const { getAllDeliveryPersons, getDeliveryPersonById, editDeliveryPersonById, deleteDeliveryPersonById, postdeliveryPerson} = require('../controllers/deliveryPersonController')

router.get('/alldeliveryPerson',getAllDeliveryPersons);
router.get('/deliveryPerson/:id',getDeliveryPersonById);

router.put('/edit_DeliveryPerson/:id',editDeliveryPersonById);
router.delete('/delete_DeliveryPerson/:id',deleteDeliveryPersonById);

router.post('/delivery',postdeliveryPerson);


module.exports = router;
