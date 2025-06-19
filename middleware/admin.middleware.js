const User = require('../models/User.model');
const jwt = require('jsonwebtoken');

const isAdmin = async (req, res, next) => {
    try{
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Missing token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const used = await User.findById(decoded_id);
        if(!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Access denied.'});
        }

        req.user = user;

        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token', error: err });
    }
};

module.exports = { isAdmin };
