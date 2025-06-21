const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const { isAdmin } = require('../middleware/admin.middleware');

//get user logged
const getUserFromToken = async (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return await User.findById(decoded._id);
};

// [POST] create new order
router.post('/', async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const { items, shippingAddress, totalAmount, paymentId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must include at least one item.' });
    }

    // Check if product exist
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
      user: user._id,
      items,
      shippingAddress,
      totalAmount,
      paymentId: paymentId || null
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error creating order', error: err });
  }
});

// [GET] check orders (private route)
router.get('/me', async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err });
  }
});

// [GET] check all orders (admin)
router.get('/', isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'email')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err });
  }
});

// [PUT] Update order status (admin)
router.put('/:orderId/status', isAdmin, async (req, res) => {
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
