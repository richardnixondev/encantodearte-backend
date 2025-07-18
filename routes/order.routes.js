const express = require('express');
const router = express.Router();

const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const { isAuthenticated } = require('../middleware/jwt.middleware.js');
const { isAdmin } = require('../middleware/admin.middleware');

// [POST] create new order (user)
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const userId = req.payload._id;

    const { items, shippingAddress, totalAmount, paymentId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must include at least one item.' });
    }

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.product}` });
      }
      if (item.quantity > product.stock) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
    }

    const order = await Order.create({
      user: userId,
      items,
      shippingAddress,
      totalAmount,
      paymentId: paymentId || null
    });

    res.status(201).json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error creating order', error: err });
  }
});

// [GET] user's own orders
router.get('/me', isAuthenticated, async (req, res) => {
  try {
    const userId = req.payload._id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user orders', error: err });
  }
});

// [GET] all orders (admin only)
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'email')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all orders', error: err });
  }
});

// [PUT] update order status (admin only)
router.put('/:orderId/status', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Error updating status', error: err });
  }
});

module.exports = router;
