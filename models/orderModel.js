const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    store: {
        type: Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        name: String,
        quantity: String,
        price: {
            type: Number,
            default: 0
        }
    }],
    totalAmount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['completed', 'uncompleted'],
        default: 'uncompleted'
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', OrderSchema);
