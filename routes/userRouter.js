const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../utilities/authMiddleware'); // Ensure this path is correct

// Register a new user
router.post('/register', userController.register);

// Login user
router.post('/login', userController.login);

// Get user profilez
router.get('/profile', authMiddleware, userController.getProfile);

// Update user profile
router.put('/profile', authMiddleware, userController.updateProfile);

// Get all orders of the user
router.get('/orders', authMiddleware, userController.getAllOrders);

// Get orders of the user for a particular store
router.get('/orders/store/:storeId', authMiddleware, userController.getOrdersByStore);

module.exports = router;
