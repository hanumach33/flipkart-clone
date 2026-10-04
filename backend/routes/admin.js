const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/authMiddleware');

// All admin routes require authentication + admin role
router.use(protect, admin);

// ─── @desc  Get dashboard stats
// ─── @route GET /api/admin/stats
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const [totalUsers, totalProducts, totalOrders, revenueResult] =
      await Promise.all([
        User.countDocuments({ role: 'user' }),
        Product.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([
          { $match: { status: { $ne: 'Cancelled' } } },
          { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]),
      ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
      },
    });
  })
);

// ─── @desc  Get all users
// ─── @route GET /api/admin/users
router.get(
  '/users',
  asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users, total: users.length });
  })
);

// ─── @desc  Get user by ID
// ─── @route GET /api/admin/users/:id
router.get(
  '/users/:id',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json({ success: true, data: user });
  })
);

// ─── @desc  Update user role
// ─── @route PUT /api/admin/users/:id
router.put(
  '/users/:id',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    if (req.body.role) user.role = req.body.role;
    if (req.body.name) user.name = req.body.name;
    const updatedUser = await user.save();
    res.json({ success: true, data: { _id: updatedUser._id, name: updatedUser.name, role: updatedUser.role } });
  })
);

// ─── @desc  Delete user
// ─── @route DELETE /api/admin/users/:id
router.delete(
  '/users/:id',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    if (user.role === 'admin') {
      res.status(400);
      throw new Error('Cannot delete an admin user');
    }
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted successfully' });
  })
);

module.exports = router;
