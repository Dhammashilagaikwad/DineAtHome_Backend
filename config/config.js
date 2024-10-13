// config.js
require('dotenv').config(); // Ensure dotenv is loaded first

const config = {
    mongoURI: process.env.MONGO_URI,
    port: process.env.PORT || 4000,
    
};

module.exports = config;
