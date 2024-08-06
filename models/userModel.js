const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['customer', 'storeOwner'],
        default: 'customer'
    },
    address: {
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        }
    },
    phone: {
        type: String,
        required: true
    },
    stores: [{
        type: Schema.Types.ObjectId,
        ref: 'Store'
    }],
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
