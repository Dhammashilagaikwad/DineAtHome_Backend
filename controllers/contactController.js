const  Contact = require("../models/contactModel");

// get all contacts 
const getAllContacts = async (req,res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts', error });
    }
}

//get contact by Id

const getContactById = async (req,res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contact', error });
    }
}


//edit contact By Id
 const editContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Error updating contact', error });
    }
 }


 // delete contact by Id

 const deleteContact = async (req,res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(204).send(); // No content to send back
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact', error });
    }
 }


// Handle POST request to submit contact form
 const postContact = async(req, res) => {
    console.log("its working", req.body);
    const { name, email, mobileNumber, subject, message } = req.body;

    try {

       // Ensure all fields are provided
       if (!name || !email || !mobileNumber || !subject || !message) {
        return res.status(400).json({ status: false, message: "All fields are required." });
    }

        const contact = new Contact({
            name,
            email,
            mobileNumber,
            subject,
            message,
        });

        await contact.save();
        res.status(201).json({ status: true, message: "your message submitted sucessfully"});
    } catch (error) {
        console.error("Error while saving contact:", error.message);
        res.status(400).json({ status: false, message: "something went wrong" });
    }
};


module.exports = {
    getAllContacts,
    getContactById,
    editContact,
    deleteContact,
    postContact,
}
