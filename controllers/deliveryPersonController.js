const DeliveryPerson = require("../models/deliveryPersonModel")


// get all deliveryPerson
const getAllDeliveryPersons = async (req, res) => {
    try {
        const deliveryPersons = await DeliveryPerson.find();  // Fetch all delivery persons
        res.status(200).json({ status: true, data: deliveryPersons });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: false, message: "Failed to fetch delivery persons" });
    }
};


// get deliverPerson By id

const getDeliveryPersonById = async (req, res) => {
    const { id } = req.params;
    try {
        const deliveryPerson = await DeliveryPerson.findById(id);  // Fetch delivery person by ID
        if (!deliveryPerson) {
            return res.status(404).json({ status: false, message: "Delivery person not found" });
        }
        res.status(200).json({ status: true, data: deliveryPerson });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: false, message: "Failed to fetch delivery person" });
    }
};


//edit deliver person by id 
const editDeliveryPersonById = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    try {
        const deliveryPerson = await DeliveryPerson.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!deliveryPerson) {
            return res.status(404).json({ status: false, message: "Delivery person not found" });
        }
        res.status(200).json({ status: true, data: deliveryPerson });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: false, message: "Failed to update delivery person" });
    }
};

// delete deliveryperson By Id
const deleteDeliveryPersonById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const deliveryPerson = await DeliveryPerson.findByIdAndDelete(id);  // Delete by ID
        if (!deliveryPerson) {
            return res.status(404).json({ status: false, message: "Delivery person not found" });
        }
        res.status(200).json({ status: true, message: "Delivery person deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: false, message: "Failed to delete delivery person" });
    }
};


// Handle POST request to submit delivery person form
const postdeliveryPerson = async (req, res) => {
    console.log("POST request received", req.body);

    const { name, mobileNumber, email, city, address } = req.body;

    try {
        const delivery = new DeliveryPerson({
            name,
            mobileNumber,
            email,
            city,
            address,
        });

        await delivery.save();
        res.status(201).json({ status: true, message: "Your message submitted successfully" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: false, message: "Something went wrong" });
    }
};


module.exports = {
    getAllDeliveryPersons,
    getDeliveryPersonById,
    editDeliveryPersonById,
    deleteDeliveryPersonById,
    postdeliveryPerson
}