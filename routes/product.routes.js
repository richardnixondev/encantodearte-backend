const express = require('express');
const router = express.Router();

const Product = require('../models/Product.model');
const { isAuthenticated } = require {'../middleware/jwt.middleware'};

//Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: 'Erro fetching products', error: err });
    }
});

//Get Product by ID
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

// Post create New Product (private router)
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const {name, description, category, price, stock, imageUrl } = req.body;
    
        const newProduct = await Product.create({
            name,
            description,
            categoty,
            price,
            stock,
            imageUrl,
            createdBy: req.payload._id //from jwt auth token
        });

        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: 'Error creating product', error: err });
    }
});

// Put update product by ID (private router)
router.put('/:productId', isAuthenticated, async(req, res) => {
    try{
        const updatedProduct = await Product.findByIdAndUpdate({
            req.params.productId,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Error updateing product', error: err });
        }
        res.status(200).json(updateProduct);
  } catch (err) {
        res.status(400).json({ message: 'Error updating', error: err});
  }
});

//Delete product by ID (private router)
router.delete('/:productId', isAuthenticated, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req, res) => {
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product now found' });
        }
        res.status(200)/.json({'produc deleted successfully'})
     } catch (err) {
        res.status.(500).json({ message: 'Error deleting product', error: err });
    } 
});

module.exports = router;