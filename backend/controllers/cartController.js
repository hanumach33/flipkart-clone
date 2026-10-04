const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// ─── @desc  Get current user's cart
// ─── @route GET /api/cart
// ─── @access Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product',
    'name images price discountPrice discountPercent stock brand'
  );

  if (!cart) {
    return res.json({ success: true, data: { user: req.user._id, items: [] } });
  }

  res.json({ success: true, data: cart });
});

// ─── @desc  Add item to cart or increment quantity
// ─── @route POST /api/cart
// ─── @access Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error('Product ID is required');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error(`Only ${product.stock} units available in stock`);
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingItemIndex > -1) {
    const newQty = cart.items[existingItemIndex].quantity + Number(quantity);
    if (newQty > product.stock) {
      res.status(400);
      throw new Error(`Cannot add more. Only ${product.stock} units in stock`);
    }
    cart.items[existingItemIndex].quantity = newQty;
  } else {
    cart.items.push({
      product: productId,
      quantity: Number(quantity),
      price: product.discountPrice || product.price,
    });
  }

  await cart.save();
  await cart.populate('items.product', 'name images price discountPrice discountPercent stock brand');

  res.status(201).json({ success: true, data: cart });
});

// ─── @desc  Update quantity of a specific cart item
// ─── @route PUT /api/cart/:itemId
// ─── @access Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  if (!quantity || quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const item = cart.items.id(itemId);
  if (!item) {
    res.status(404);
    throw new Error('Cart item not found');
  }

  const product = await Product.findById(item.product);
  if (product && Number(quantity) > product.stock) {
    res.status(400);
    throw new Error(`Only ${product.stock} units available in stock`);
  }

  item.quantity = Number(quantity);
  await cart.save();
  await cart.populate('items.product', 'name images price discountPrice discountPercent stock brand');

  res.json({ success: true, data: cart });
});

// ─── @desc  Remove a specific item from cart
// ─── @route DELETE /api/cart/:itemId
// ─── @access Private
const removeFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const itemExists = cart.items.id(itemId);
  if (!itemExists) {
    res.status(404);
    throw new Error('Cart item not found');
  }

  cart.items.pull({ _id: itemId });
  await cart.save();
  await cart.populate('items.product', 'name images price discountPrice discountPercent stock brand');

  res.json({ success: true, data: cart });
});

// ─── @desc  Clear all items from cart
// ─── @route DELETE /api/cart/clear
// ─── @access Private
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.json({ success: true, message: 'Cart is already empty' });
  }

  cart.items = [];
  await cart.save();

  res.json({ success: true, message: 'Cart cleared successfully', data: cart });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
