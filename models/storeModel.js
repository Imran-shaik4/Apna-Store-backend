const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    address: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        }
    },
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Store', StoreSchema);