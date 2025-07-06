const User = require('../models/User.model');

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.payload?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Missing payload in request' });
    }

    const user = await User.findById(userId);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify admin status', error });
  }
};

module.exports = { isAdmin };
