const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// ─── @desc  Register a new user
// ─── @route POST /api/auth/register
// ─── @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    res.status(409);
    throw new Error('A user with this email already exists');
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      wishlist: user.wishlist,
      token: generateToken(user._id),
    },
  });
});

// ─── @desc  Login user & get token
// ─── @route POST /api/auth/login
// ─── @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      wishlist: user.wishlist,
      token: generateToken(user._id),
    },
  });
});

// ─── @desc  Get current user profile
// ─── @route GET /api/auth/profile
// ─── @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      wishlist: user.wishlist,
      createdAt: user.createdAt,
    },
  });
});

// ─── @desc  Update current user profile
// ─── @route PUT /api/auth/profile
// ─── @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email.toLowerCase();
  if (req.body.password) {
    if (req.body.password.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters');
    }
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    },
  });
});

// ─── @desc  Add product to wishlist
// ─── @route POST /api/auth/wishlist/:productId
// ─── @access Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const alreadyInWishlist = user.wishlist.some(
    (id) => id.toString() === productId
  );

  if (alreadyInWishlist) {
    res.status(409);
    throw new Error('Product already in wishlist');
  }

  user.wishlist.push(productId);
  await user.save();

  res.status(201).json({
    success: true,
    message: 'Product added to wishlist',
    data: user.wishlist,
  });
});

// ─── @desc  Remove product from wishlist
// ─── @route DELETE /api/auth/wishlist/:productId
// ─── @access Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
  await user.save();

  res.json({
    success: true,
    message: 'Product removed from wishlist',
    data: user.wishlist,
  });
});

// ─── @desc  Get populated wishlist
// ─── @route GET /api/auth/wishlist
// ─── @access Private
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    data: user.wishlist,
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};
