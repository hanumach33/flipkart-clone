const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// ─── @desc  Create a new order from cart
// ─── @route POST /api/orders
// ─── @access Private
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice, items } = req.body;

  if (!shippingAddress || !items || items.length === 0) {
    res.status(400);
    throw new Error('Shipping address and order items are required');
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod: paymentMethod || 'COD',
    itemsPrice: itemsPrice || 0,
    taxPrice: taxPrice || 0,
    shippingPrice: shippingPrice || 0,
    totalPrice: totalPrice || itemsPrice,
  });

  // Clear the user's cart after placing the order
  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $set: { items: [] } }
  );

  res.status(201).json({ success: true, data: order });
});

// ─── @desc  Get orders for logged-in user
// ─── @route GET /api/orders/my
// ─── @access Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: orders, total: orders.length });
});

// ─── @desc  Get single order by ID
// ─── @route GET /api/orders/:id
// ─── @access Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Only allow access if admin or order owner
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({ success: true, data: order });
});

// ─── @desc  Get all orders (admin)
// ─── @route GET /api/orders
// ─── @access Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;

  const filter = {};
  if (status) filter.status = status;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Order.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: orders,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    total,
  });
});

// ─── @desc  Update order status (admin)
// ─── @route PUT /api/orders/:id/status
// ─── @access Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

  if (!status || !validStatuses.includes(status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;

  if (status === 'Delivered') {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }

  if (status === 'Cancelled') {
    order.isDelivered = false;
  }

  const updatedOrder = await order.save();
  res.json({ success: true, data: updatedOrder });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
