const User = require('../models/userModel');
const Order = require('../models/orderModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
    const { name, email, password, role, address, phone } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create a new user instance
        user = new User({
            name,
            email,
            password,
            role,
            address,
            phone
        });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save the user
        await user.save();

        // Generate JWT token
        const payload = { user: { id: user.id } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Authenticate user and get token
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Check the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Generate JWT token
        const payload = { user: { id: user.id } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password').populate('orders');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// // Update user profile
// exports.updateProfile = async (req, res) => {
//     const { name, address, phone } = req.body;
//     const userFields = { name, address, phone };

//     try {
//         let user = await User.findById(req.user.id);
//         if (!user) {
//             return res.status(404).json({ msg: 'User not found' });
//         }

//         user = await User.findByIdAndUpdate(
//             req.user.id,
//             { $set: userFields },
//             { new: true }
//         ).select('-password');

//         res.json(user);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// };
// Update user profile
// exports.updateProfile = async (req, res) => {
//     const { name, address, phone } = req.body;

//     try {
//         let user = await User.findById(req.user.id);
//         if (!user) {
//             return res.status(404).json({ msg: 'User not found' });
//         }

//         // Update the fields individually
//         if (name) user.name = name;
//         if (phone) user.phone = phone;
//         if (address) {
//             if (address.city) user.address.city = address.city;
//             if (address.state) user.address.state = address.state;
//         }

//         await user.save();
//         user = await User.findById(req.user.id).select('-password');

//         res.json(user);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// };
// Update user profile
// exports.updateProfile = async (req, res) => {
//     const { name, address: newAddress, phone } = req.body;
//     console.log(name, newAddress, phone);

//     try {
//         let user = await User.findById(req.user.id);
//         if (!user) {
//             return res.status(404).json({ msg: 'User not found' });
//         }

//         // Merge the existing address with the new address fields
//         const updatedAddress = {
//             ...user.address.toObject(), // Convert the Mongoose object to a plain object
//             ...newAddress,
//         };

//         const userFields = { name, phone, address: updatedAddress };

//         user = await User.findByIdAndUpdate(
//             req.user.id,
//             { $set: userFields },
//             { new: true }
//         ).select('-password');

//         res.json(user);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// };
exports.updateProfile = async (req, res) => {
    const { name, city, state, phone } = req.body;

    // Build user fields object
    const userFields = { name, phone };

    // Add address subfields only if they are provided
    if (city || state) {
        userFields.address = {};
        if (city) userFields.address.city = city;
        if (state) userFields.address.state = state;
    }

    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: userFields },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};




// Get all orders of the user
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('store', 'name address phone email');
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get orders of the user for a particular store
exports.getOrdersByStore = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id, store: req.params.storeId }).populate('store', 'name address');
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
