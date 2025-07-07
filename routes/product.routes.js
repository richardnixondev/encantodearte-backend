const express = require('express');
const router = express.Router();

const Product = require("../models/Product.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const upload = require("../middleware/upload.middleware.js"); // middleware to upload
const { isAdmin } = require('../middleware/admin.middleware');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    console.log("[GET /products] Returned", products.length, "products");
    res.status(200).json(products);
  } catch (err) {
    console.error("[GET /products] Error:", err);
    res.status(500).json({ message: 'Erro fetching products', error: err });
  }
});

// GET product by ID
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    console.log("[GET /products/:id] Checking ID:", productId);

    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn("[GET /products/:id] Invalid ID format");
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const product = await Product.findById(productId);

    if (!product) {
      console.warn("[GET /products/:id] Product not found");
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log("[GET /products/:id] Product found:", product.name);
    res.status(200).json(product);
  } catch (err) {
    console.error("[GET /products/:id] Error:", err);
    res.status(500).json({ message: 'Error fetching product', error: err });
  }
});

// POST create new product with image
router.post('/', isAuthenticated, isAdmin, upload.single('image'), async (req, res) => {
  try {
    console.log("[POST /products] Payload from JWT:", req.payload);
    console.log("[POST /products] Body:", req.body);
    console.log("[POST /products] File:", req.file?.filename);

    const { name, description, category, price, stock } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const newProduct = await Product.create({
      name,
      description,
      category,
      price,
      stock,
      imageUrl,
      createdBy: req.payload._id
    });

    console.log("[POST /products] Created:", newProduct._id);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("[POST /products] Error:", err);
    res.status(400).json({ message: 'Error creating product', error: err });
  }
});

// PUT update product by ID
router.put('/:productId', isAuthenticated, isAdmin, upload.single('image'), async (req, res) => {
  try {
    console.log("[PUT /products/:id] User:", req.payload);
    console.log("[PUT /products/:id] Body:", req.body);

    const { name, description, category, price, stock } = req.body;

    const updatedFields = {
      name,
      description,
      category,
      price,
      stock,
    };

    if (req.file) {
      updatedFields.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      updatedFields,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      console.warn("[PUT /products/:id] Product not found");
      return res.status(404).json({ message: 'Product not found.' });
    }

    console.log("[PUT /products/:id] Updated:", updatedProduct._id);
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("[PUT /products/:id] Error:", err);
    res.status(400).json({ message: 'Error updating product', error: err });
  }
});

// DELETE product by ID
router.delete('/:productId', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { productId } = req.params;

    console.log("[DELETE /products/:id] Requested by:", req.payload);

    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn("[DELETE /products/:id] Invalid ID");
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      console.warn("[DELETE /products/:id] Product not found");
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log("[DELETE /products/:id] Deleted:", deletedProduct._id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error("[DELETE /products/:id] Error:", err);
    res.status(500).json({ message: 'Error deleting product', error: err });
  }
});

module.exports = router;
