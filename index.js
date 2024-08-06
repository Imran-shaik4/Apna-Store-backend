const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./utilities/db');
const userRoutes = require('./routes/userRouter');
const storeRoutes = require('./routes/storeRouter');
const orderRoutes = require('./routes/orderRouter');
require('dotenv').config();

// Connect to the database
connectDB();

// Middleware
app.use(express.json()); // No need for { extended: false }
app.use(cors());
// Routes
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
