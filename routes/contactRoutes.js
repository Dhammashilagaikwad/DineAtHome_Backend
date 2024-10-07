// routes/contactRoutes.js

const { Router } = require("express");
const router = Router();
const {getAllContacts, getContactById, editContact, deleteContact, postContact} = require('../controllers/contactController');

router.get('/get-contact-us',getAllContacts);
router.get('/contact-us/:id',getContactById);

router.put('/editContact/:id',editContact);

router.delete('/deleteContact/:id',deleteContact);

router.post('/contact-us',postContact)
    

module.exports = router;
