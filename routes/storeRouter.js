// storeRoutes.js
const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { authMiddleware, storeOwnerAuth } = require('../utilities/authMiddleware');

// Create a new store
router.post('/', authMiddleware, storeController.createStore);

// Get all stores with pagination
router.get('/', storeController.getAllStores);

// Get all stores of a particular user
router.get('/user', authMiddleware, storeController.getStoresByUser);

// Get a store by ID
router.get('/:id', storeController.getStoreById);

// Update a store
router.put('/:storeId', storeOwnerAuth, storeController.updateStore);

// Delete a store
router.delete('/:storeId', storeOwnerAuth, storeController.deleteStore);

// Search stores by name
router.get('/search/name', storeController.searchStoresByName);

// Search stores by city
router.get('/search/city', storeController.searchStoresByCity);

module.exports = router;
