const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// NOTE: /my must be declared before /:id to avoid Express treating "my" as an id param
router.get('/my', protect, getMyOrders);

router.post('/', protect, createOrder);
router.get('/', protect, admin, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
