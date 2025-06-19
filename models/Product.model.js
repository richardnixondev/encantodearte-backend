const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Product name is required.'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required.'],
        minlength: 10
    }, 
    categoty: {
        type: String,
        required: true,
        enum: ['Decor', 'Accessories', 'Textiles', 'Ceramics', 'Jewelry', 'Woodwork', 'Other'],
        default: 'Other'
    }, 
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be a positive number.']
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    imageUrl: {
        type: String,
        default: 'http://praceholderforcache.com'
    },
    isActive: {
        type: Boolean,
        default:true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Product = model('Product', productSchema);

module.exports = Product;