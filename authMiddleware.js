// authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET; // Replace with your secret key

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

function authorizeRole(requiredRole) {
    return function (req, res, next) {
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    };
}

module.exports = { authenticateToken, authorizeRole };
