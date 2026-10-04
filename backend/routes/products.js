const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getCategories,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
// NOTE: /categories must be declared before /:id to avoid conflict
router.get('/categories', getCategories);
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes
router.post('/:id/reviews', protect, createProductReview);

// Admin routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
