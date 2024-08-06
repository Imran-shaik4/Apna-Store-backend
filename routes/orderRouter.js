const express = require('express');
const router = express.Router();
const { authMiddleware, storeOwnerAuth } = require('../utilities/authMiddleware');
const orderController = require('../controllers/orderController');

// Order routes
router.post('/', authMiddleware, orderController.createOrder);
router.put('/:orderId/store/:storeId', storeOwnerAuth, orderController.updateOrder);
router.get('/store/:storeId', storeOwnerAuth, orderController.getOrdersByStore);
router.get('/store/:storeId/today', storeOwnerAuth, orderController.getTodaysOrders);
router.get('/store/:storeId/today/completed', storeOwnerAuth, orderController.getTodaysCompletedOrders);
router.get('/store/:storeId/today/uncompleted', storeOwnerAuth, orderController.getTodaysUncompletedOrders);
router.get('/store/:storeId/date/:date', storeOwnerAuth, orderController.getOrdersByDate);

module.exports = router;
