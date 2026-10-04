const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// ─── @desc  Get all products with filtering, search, and pagination
// ─── @route GET /api/products
// ─── @access Public
const getProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    minRating,
    page = 1,
    limit = 12,
  } = req.query;

  const filter = {};

  // Keyword search on name and description
  if (keyword) {
    filter.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ];
  }

  // Category filter
  if (category) {
    filter.category = { $regex: `^${category}$`, $options: 'i' };
  }

  // Price range filter
  if (minPrice || maxPrice) {
    filter.discountPrice = {};
    if (minPrice) filter.discountPrice.$gte = Number(minPrice);
    if (maxPrice) filter.discountPrice.$lte = Number(maxPrice);
  }

  // Minimum rating filter
  if (minRating) {
    filter.rating = { $gte: Number(minRating) };
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [products, totalCount] = await Promise.all([
    Product.find(filter).skip(skip).limit(limitNum).lean(),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: products,
    page: pageNum,
    pages: Math.ceil(totalCount / limitNum),
    total: totalCount,
  });
});

// ─── @desc  Get single product by ID
// ─── @route GET /api/products/:id
// ─── @access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    'reviews.user',
    'name'
  );

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, data: product });
});

// ─── @desc  Create a new product
// ─── @route POST /api/products
// ─── @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    brand,
    category,
    images,
    price,
    discountPrice,
    discountPercent,
    stock,
    seller,
  } = req.body;

  if (!name || !description || !brand || !category || !price) {
    res.status(400);
    throw new Error('Please fill in all required product fields');
  }

  const product = await Product.create({
    name,
    description,
    brand,
    category,
    images: images || [],
    price,
    discountPrice: discountPrice || price,
    discountPercent: discountPercent || 0,
    stock: stock || 0,
    seller: seller || 'Flipkart Seller',
  });

  res.status(201).json({ success: true, data: product });
});

// ─── @desc  Update a product
// ─── @route PUT /api/products/:id
// ─── @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const allowedFields = [
    'name', 'description', 'brand', 'category', 'images',
    'price', 'discountPrice', 'discountPercent', 'stock', 'seller',
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  const updatedProduct = await product.save();
  res.json({ success: true, data: updatedProduct });
});

// ─── @desc  Delete a product
// ─── @route DELETE /api/products/:id
// ─── @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted successfully' });
});

// ─── @desc  Create or update a product review
// ─── @route POST /api/products/:id/reviews
// ─── @access Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    res.status(400);
    throw new Error('Please provide a rating and comment');
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(409);
    throw new Error('You have already reviewed this product');
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ success: true, message: 'Review added successfully' });
});

// ─── @desc  Get distinct product categories
// ─── @route GET /api/products/categories
// ─── @access Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  res.json({ success: true, data: categories });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getCategories,
};
