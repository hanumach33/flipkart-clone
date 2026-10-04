const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:productId', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);

module.exports = router;
