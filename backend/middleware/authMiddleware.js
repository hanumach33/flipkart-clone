const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

/**
 * Middleware: protect
 * Verifies the Bearer JWT from the Authorization header.
 * Attaches the authenticated user (without password) to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User not found, authorization denied');
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});

/**
 * Middleware: admin
 * Must be used AFTER protect middleware.
 * Checks that the authenticated user has the 'admin' role.
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

module.exports = { protect, admin };
