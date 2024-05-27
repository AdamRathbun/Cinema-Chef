const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.decode(token);
    if (!decoded) throw new Error('Invalid token');

    if (decoded.aud !== "authenticated") {
      return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }

    req.user = { id: decoded.sub };

    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Unauthorized: Token verification failed.' });
  }
};

module.exports = {
  authenticateToken,
};
