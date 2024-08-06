const Store = require('../models/storeModel');
const User = require('../models/userModel');

// Create a new store
exports.createStore = async (req, res) => {
    const { name, address } = req.body;

    try {
        const newStore = new Store({
            name,
            owner: req.user.id,
            address
        });

        const store = await newStore.save();

        // Add the store to the user's stores array
        await User.findByIdAndUpdate(
            req.user.id,
            {
                $push: { stores: store.id },
                $set: { role:"storeOwner"}
            }
        );

        res.json(store);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get all stores with pagination
// exports.getAllStores = async (req, res) => {
//     const page = parseInt(req.query.page, 10) || 1;
//     const limit = parseInt(req.query.limit, 10) || 10;
//     const skip = (page - 1) * limit;

//     try {
//         const stores = await Store.find()
//             .skip(skip)
//             .limit(limit)
//             .populate('owner', 'name email');

//         const totalStores = await Store.countDocuments();

//         res.json({
//             stores,
//             totalPages: Math.ceil(totalStores / limit),
//             currentPage: page
//         });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// };

exports.getAllStores = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    try {
        const stores = await Store.find({}, '-orders') // Exclude the orders field
            .skip(skip)
            .limit(limit)
            .populate('owner', 'name email');

        const totalStores = await Store.countDocuments();

        res.json({
            stores,
            totalPages: Math.ceil(totalStores / limit),
            currentPage: page
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};



// Get all stores of a particular user
exports.getStoresByUser = async (req, res) => {
    try {
        const stores = await Store.find({ owner: req.user.id }, '-orders').populate('owner', 'name email');
        res.json(stores);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get a store by ID
exports.getStoreById = async (req, res) => {
    try {
        const store = await Store.findById(req.params.id).populate('owner', 'name email');

        if (!store) {
            return res.status(404).json({ msg: 'Store not found' });
        }

        res.json(store);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update a store
exports.updateStore = async (req, res) => {
    const { name, address } = req.body;

    try {
        let store = await Store.findById(req.params.storeId);

        if (!store) {
            return res.status(404).json({ msg: 'Store not found' });
        }

        // Check if the user owns the store
        if (store.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        store = await Store.findByIdAndUpdate(
            req.params.storeId,
            { $set: { name, address } },
            { new: true }
        );

        res.json(store);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Delete a store
// exports.deleteStore = async (req, res) => {
//     try {
//         let store = await Store.findById(req.params.id);

//         if (!store) {
//             return res.status(404).json({ msg: 'Store not found' });
//         }

//         // Check if the user owns the store
//         if (store.owner.toString() !== req.user.id) {
//             return res.status(401).json({ msg: 'User not authorized' });
//         }

//         await Store.findByIdAndRemove(req.params.id);

//         // Remove the store from the user's stores array
//         await User.findByIdAndUpdate(
//             req.user.id,
//             { $pull: { stores: req.params.id } }
//         );

//         res.json({ msg: 'Store removed' });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// };
exports.deleteStore = async (req, res) => {
    try {
        let store = await Store.findById(req.params.storeId);

        if (!store) {
            return res.status(404).json({ msg: 'Store not found' });
        }

        // Check if the user owns the store
        if (store.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Store.findByIdAndDelete(req.params.storeId);

        // Remove the store from the user's stores array
        await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { stores: req.params.storeId } }
        );

        res.json({ msg: 'Store removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


// Search stores by name
exports.searchStoresByName = async (req, res) => {
    const { name } = req.query;

    try {
        const stores = await Store.find({ name: new RegExp(name, 'i') }).populate('owner', 'name email');
        res.json(stores);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Search stores by city
exports.searchStoresByCity = async (req, res) => {
    const { city } = req.query;

    try {
        const stores = await Store.find({ 'address.city': new RegExp(city, 'i') }).populate('owner', 'name email');
        res.json(stores);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
