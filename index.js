const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const config = require('./config/config');
const bodyParser = require('body-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

// Import your routes
const contactRoutes = require('./routes/contactRoutes');
const userRoute = require('./routes/userRoutes'); // User routes
const emailRoutes = require('./routes/emailRoutes');
const preOrderRoutes = require('./routes/preOrderRoutes');
const deliveryRoute = require('./routes/deliveryPersonRoute');
const addItemRoute = require('./routes/addItemRoutes');
const chefRoutes = require('./routes/chefRoutes');
const orderRoutes = require('./routes/orderRoutes');
const locationRoutes = require('./routes/locationRoutes');
const shopRoutes = require('./routes/shopRoutes');
// const menuRoutes = require('./routes/menuRoutes');
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require('./routes/cartRoutes');
const menuCartRoutes = require('./routes/menuCartRoutes');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Update with your frontend's URL
  credentials: true // Allow credentials if you are using cookies
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));//shop
app.use('/item-uploads', express.static(path.join(__dirname, 'public','item-uploads')));//menu items
app.use('/coverImage-uploads', express.static(path.join(__dirname, 'public','coverImage-uploads')));//chef coverimage
app.use('/profilephoto', express.static(path.join(__dirname, 'public','profilephoto')));//chef profilephoto




// Example route
app.get('/', (req, res) => {
  res.status(200).json({ status: true, message: "Your message submitted successfully" });
});

// Use routes
app.use('/contacts', contactRoutes);
app.use('/api/user', userRoute);
app.use('/email', emailRoutes);
app.use('/deliveryPerson', deliveryRoute);
app.use('/preOrder', preOrderRoutes);
app.use('/addItem', addItemRoute);
app.use('/api/chefs', chefRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/shop', shopRoutes);
// app.use('/api/menu', menuRoutes); // Updated to lowercase
app.use('/api/', authRoutes);
app.use('/api/cart', cartRoutes)
app.use('/api/menuCart', menuCartRoutes);

// Start the server using the port from config
const PORT = config.port || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


