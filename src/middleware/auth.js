const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || 'aura_secret_key_2024';

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid or missing token format' });
  }

  const bearerToken = token.split(' ')[1];

  jwt.verify(bearerToken, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = { verifyToken, SECRET_KEY };
