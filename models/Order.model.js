const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const orderItemSchema = new Schema ({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
}, { _id: false });

const shippingAddressSchema = new Schema({
    fullName: { type: String, required: true},
    street: { type: String, required: true},
    number: { type: String, required: true},
    completment: { type: String },
    city: {type: String, required: true },
    state: {
        type: String,
        enum: [
            'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
        'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
        'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
        ],
        required: true
    },
    zipcode: { type: String, requined: true },
    country: {
        type: String,
        default: 'Brasil',
        enum: ['Brasil'],
        required: true
    },
    phone: {type: String, required: true }
}, { _id: false });

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentId: {type: String}
}, {
    timestamps: true
});

const Order = model('Order', orderSchema);

module.exports = Order;