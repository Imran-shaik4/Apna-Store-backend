const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Store = require('../models/storeModel');

exports.authMiddleware = async (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

exports.storeOwnerAuth = async (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        const user = await User.findById(req.user.id);

        if (user.role !== 'storeOwner') {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // console.log("req.params.storeId:", req.params.storeId);
        const store = await Store.findById(req.params.storeId);

        if (store.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to access this store' });
        }

        next();
    } catch (err) {
        console.log(err);
        
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
