const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef', required: true },
    itemname: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: 'default_image_url.png' },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true },
});

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;

