const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// ─── @desc  Get all products with filtering, search, and pagination
// ─── @route GET /api/products
// ─── @access Public
const getProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    search,
    category,
    minPrice,
    maxPrice,
    minRating,
    sort,
    page = 1,
    limit = 20,
  } = req.query;

  const filter = {};

  // Support both 'keyword' and 'search' query params
  const searchQuery = search || keyword;
  if (searchQuery) {
    filter.$or = [
      { name: { $regex: searchQuery, $options: 'i' } },
      { description: { $regex: searchQuery, $options: 'i' } },
      { brand: { $regex: searchQuery, $options: 'i' } },
      { category: { $regex: searchQuery, $options: 'i' } },
    ];
  }

  // Category filter — handles single or comma-separated list flexibly
  if (category) {
    const catList = category.split(',').map((c) => c.trim()).filter(Boolean);
    if (catList.length > 0) {
      filter.category = {
        $in: catList.map((cat) => new RegExp(`^${cat}`, 'i')),
      };
    }
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

  // Sort handling
  let sortOption = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { discountPrice: 1 };
  if (sort === 'price_desc') sortOption = { discountPrice: -1 };
  if (sort === 'rating') sortOption = { rating: -1 };
  if (sort === 'newest') sortOption = { createdAt: -1 };

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;
  const skip = (pageNum - 1) * limitNum;

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);

  res.json({
    success: true,
    products,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
    total,
  });
});

// ─── @desc  Get single product by ID
// ─── @route GET /api/products/:id
// ─── @access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({
    success: true,
    data: product,
  });
});

// ─── @desc  Create a product
// ─── @route POST /api/products
// ─── @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    brand,
    category,
    price,
    discountPrice,
    discountPercent,
    stock,
    seller,
    images,
  } = req.body;

  const product = new Product({
    name,
    description,
    brand,
    category,
    price,
    discountPrice: discountPrice || price,
    discountPercent:
      discountPercent ||
      (discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0),
    stock: stock || 0,
    seller: seller || 'Flipkart Seller',
    images: images && images.length ? images : ['https://via.placeholder.com/300'],
  });

  const createdProduct = await product.save();
  res.status(201).json({
    success: true,
    data: createdProduct,
  });
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

  const fields = [
    'name',
    'description',
    'brand',
    'category',
    'price',
    'discountPrice',
    'discountPercent',
    'stock',
    'seller',
    'images',
  ];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  const updatedProduct = await product.save();
  res.json({
    success: true,
    data: updatedProduct,
  });
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
  res.json({
    success: true,
    message: 'Product deleted',
  });
});

// ─── @desc  Create new review
// ─── @route POST /api/products/:id/reviews
// ─── @access Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed by you');
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
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({
    success: true,
    message: 'Review added',
    data: product,
  });
});

// ─── @desc  Get all product categories
// ─── @route GET /api/products/categories
// ─── @access Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  res.json({
    success: true,
    data: categories,
  });
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
