const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT for the given user ID.
 * @param {string} id - MongoDB ObjectId of the user
 * @returns {string} Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
