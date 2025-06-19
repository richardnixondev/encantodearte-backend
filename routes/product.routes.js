const express = require('express');
const router = express.Router();

const Product = require('../models/Product.model');
const { isAuthenticated } = require {'../middleware/jwt.middleware'};

//get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: 'Erro fetching products', error: err });
    }
});

// Create New Product (private route)
router.get('/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found'});
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching product', error: err});
    }
});