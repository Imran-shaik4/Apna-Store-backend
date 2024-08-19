const Order = require('../models/orderModel');
const Store = require('../models/storeModel');
const User = require('../models/userModel');

// Create a new order
exports.createOrder = async (req, res) => {
    const { storeId, products } = req.body;

    try {
        const newOrder = new Order({
            store: storeId,
            user: req.user.id,
            products
        });

        const order = await newOrder.save();

        // Add the order to the user's orders array
        await User.findByIdAndUpdate(
            req.user.id,
            { $push: { orders: order.id } }
        );

        // Add the order to the store's orders array
        await Store.findByIdAndUpdate(
            storeId,
            { $push: { orders: order.id } }
        );

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update product prices and complete the order
exports.updateOrder = async (req, res) => {
    const { orderId } = req.params;
    const { products } = req.body;
    console.log(orderId);
    
    try {
        let order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        // Check if the user is the owner of the store
        const store = await Store.findById(order.store);
        if (store.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Update product prices
        order.products = order.products.map((product, index) => ({
            ...product,
            price: products[index].price
        }));

        // Calculate total amount
        order.totalAmount = order.products.reduce((total, product) => total + product.price, 0);

        // Update order status to completed
        order.status = 'completed';

        order = await order.save();

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get all orders of a store
exports.getOrdersByStore = async (req, res) => {
    try {
        const orders = await Order.find({ store: req.params.storeId }).populate('user', 'name email phone');
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get today's orders of a store
exports.getTodaysOrders = async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        const orders = await Order.find({
            store: req.params.storeId,
            orderDate: { $gte: today }
        }).populate('user', 'name email phone');
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get today's completed orders of a store
exports.getTodaysCompletedOrders = async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        const orders = await Order.find({
            store: req.params.storeId,
            orderDate: { $gte: today },
            status: 'completed'
        }).populate('user', 'name email phone');
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get today's uncompleted orders of a store
exports.getTodaysUncompletedOrders = async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        const orders = await Order.find({
            store: req.params.storeId,
            orderDate: { $gte: today },
            status: 'uncompleted'
        }).populate('user', 'name email phone');
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get all orders of a particular date
exports.getOrdersByDate = async (req, res) => {
    const { date } = req.params;
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(targetDate);
    nextDay.setDate(targetDate.getDate() + 1);

    try {
        const orders = await Order.find({
            store: req.params.storeId,
            orderDate: { $gte: targetDate, $lt: nextDay }
        }).populate('user', 'name email');
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
