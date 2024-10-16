const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const config = require('./config/config');
const bodyParser = require('body-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
require('dotenv').config();

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
const paymentsRoutes = require('./routes/paymentRoutes');

const app = express();

// Connect to the database
connectDB();

const allowedOrigins = [
  process.env.LOCAL_URL,  // Localhost (development)
  process.env.PROD_URL    // Deployed site (production)
];
// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));


app.use('/shop-uploads', express.static(path.join(__dirname,'public', 'shop-uploads')));//shop
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
app.use('/api/payments', paymentsRoutes); // Include payment routes

// Start the server using the port from config
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => 
  console.log(`Server is running on port ${PORT}`));
  console.log(`Environment: ${process.env.NODE_ENV}`);


