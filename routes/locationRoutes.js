const express = require('express');
const router = express.Router();

// POST route to receive location data
router.post('/location', (req, res) => {
    const { latitude, longitude } = req.body;

    if (latitude && longitude) {
        // Here you can process the location data, e.g., save it to the database
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        
        // Respond to the client
        res.status(200).json({ message: 'Location received successfully' });
    } else {
        res.status(400).json({ message: 'Invalid location data' });
    }
});

module.exports = router;
