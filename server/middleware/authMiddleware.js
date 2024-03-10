const jwt = require('jsonwebtoken');
const config = require('../config');
const userModel = require('../auth/userModel');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized: Missing token.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token.' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret, { expiresIn: '2h' });

    const user = await userModel.findUserByUsername(decoded.username);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
  }
};

module.exports = {
  authenticateToken,
};
