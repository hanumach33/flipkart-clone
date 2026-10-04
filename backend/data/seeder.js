require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const products = [
  // ── Mobiles ───────────────────────────────────────────────────────────────────
  {
    name: 'Samsung Galaxy M34 5G (8GB RAM, 128GB)',
    description:
      'Samsung Galaxy M34 5G with 6000mAh battery, 120Hz Super AMOLED display, 50MP triple camera, 8GB RAM + 128GB storage.',
    brand: 'Samsung',
    category: 'Mobiles',
    images: [
      'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/v/o/b/-original-imaghx9qzgfshgms.jpeg',
      'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/l/s/o/-original-imaghx9qyvhyhcjz.jpeg',
    ],
    price: 21999,
    discountPrice: 17999,
    discountPercent: 18,
    stock: 150,
    rating: 4.3,
    numReviews: 2140,
    seller: 'Retail Net',
  },
  {
    name: 'Apple iPhone 15 (128GB, Black)',
    description:
      'Apple iPhone 15 featuring the A16 Bionic chip, 48MP main camera, Dynamic Island, USB-C connector, and all-day battery life.',
    brand: 'Apple',
    category: 'Mobiles',
    images: [
      'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/j/l/e/-original-imagrqgxgxhfzjxr.jpeg',
      'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/y/g/a/-original-imagrqgxdbknh4me.jpeg',
    ],
    price: 79900,
    discountPrice: 72990,
    discountPercent: 9,
    stock: 80,
    rating: 4.7,
    numReviews: 8935,
    seller: 'Flipkart Official',
  },
  {
    name: 'realme Narzo 70 Pro 5G (Glass Green, 8GB RAM)',
    description:
      '50MP Sony IMX890 OIS camera, Dimensity 7050 chipset, 67W SUPERVOOC fast charging, 5000mAh battery, 6.7-inch AMOLED display.',
    brand: 'realme',
    category: 'Mobiles',
    images: [
      'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/h/k/y/-original-imagx5kghhbjbm7p.jpeg',
    ],
    price: 23999,
    discountPrice: 19999,
    discountPercent: 17,
    stock: 120,
    rating: 4.2,
    numReviews: 980,
    seller: 'realme Official Store',
  },

  // ── Electronics ──────────────────────────────────────────────────────────────
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description:
      'Industry-leading noise canceling with 8 microphones and Auto NC Optimizer. 30-hour battery life. Crystal-clear hands-free calling.',
    brand: 'Sony',
    category: 'Electronics',
    images: [
      'https://m.media-amazon.com/images/I/61bKDEajgbL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71o8Q5XJS5L._SL1500_.jpg',
    ],
    price: 29990,
    discountPrice: 23490,
    discountPercent: 22,
    stock: 60,
    rating: 4.6,
    numReviews: 4320,
    seller: 'Sony India Store',
  },
  {
    name: 'LG 32-inch IPS Monitor (32MR50C)',
    description:
      'Full HD IPS display with 100Hz refresh rate, AMD FreeSync, HDMI & DisplayPort inputs, Eye Comfort certified. Ideal for WFH.',
    brand: 'LG',
    category: 'Electronics',
    images: [
      'https://m.media-amazon.com/images/I/71SBGVGm7BL._SL1500_.jpg',
    ],
    price: 17999,
    discountPrice: 14499,
    discountPercent: 19,
    stock: 45,
    rating: 4.4,
    numReviews: 1250,
    seller: 'LG Electronics India',
  },

  // ── Fashion ───────────────────────────────────────────────────────────────────
  {
    name: 'Nike Air Max 270 Running Shoes',
    description:
      "Nike Air Max 270 men's running shoes with the tallest Air unit yet for incredible cushioning. Mesh upper for breathability.",
    brand: 'Nike',
    category: 'Fashion',
    images: [
      'https://rukminim2.flixcart.com/image/312/312/xif0q/shoe/k/j/a/-original-imagh5fhtyh5kgyz.jpeg',
    ],
    price: 11495,
    discountPrice: 8499,
    discountPercent: 26,
    stock: 200,
    rating: 4.5,
    numReviews: 3200,
    seller: 'Nike India',
  },
  {
    name: "Levi's 511 Slim Fit Jeans",
    description:
      "Levi's 511 slim-fit jeans in stretch denim for all-day comfort. Classic 5-pocket styling. Available in dark indigo wash.",
    brand: "Levi's",
    category: 'Fashion',
    images: [
      'https://rukminim2.flixcart.com/image/312/312/xif0q/jean/r/k/h/-original-imaghfzdhzqgztzb.jpeg',
    ],
    price: 3999,
    discountPrice: 2799,
    discountPercent: 30,
    stock: 300,
    rating: 4.3,
    numReviews: 5700,
    seller: "Levi's Official Store",
  },
  {
    name: 'Puma Essentials Fleece Hoodie',
    description:
      'PUMA Essentials fleece hoodie with kangaroo pocket, drawstring hood, and ribbed cuffs. Made from soft cotton-polyester blend.',
    brand: 'Puma',
    category: 'Fashion',
    images: [
      'https://rukminim2.flixcart.com/image/312/312/xif0q/sweatshirt/n/y/t/-original-imagx7fhzhhqtqyr.jpeg',
    ],
    price: 2999,
    discountPrice: 1799,
    discountPercent: 40,
    stock: 180,
    rating: 4.1,
    numReviews: 2100,
    seller: 'Puma Sports India',
  },

  // ── Home ──────────────────────────────────────────────────────────────────────
  {
    name: 'Prestige Iris 750 Watt Mixer Grinder',
    description:
      '750W motor with 3 stainless steel jars (1.5L liquidizing, 1L dry grinding, 0.4L chutney), 3-speed control with pulse function.',
    brand: 'Prestige',
    category: 'Home',
    images: [
      'https://rukminim2.flixcart.com/image/312/312/xif0q/mixer-grinder-juicer/n/7/w/-original-imagfkyyagxwfwfx.jpeg',
    ],
    price: 3595,
    discountPrice: 2299,
    discountPercent: 36,
    stock: 95,
    rating: 4.4,
    numReviews: 6400,
    seller: 'Prestige Smart Kitchen',
  },
  {
    name: 'IKEA KALLAX Shelf Unit (2x2)',
    description:
      'Versatile KALLAX shelf unit in white. 2×2 grid with 4 compartments. Can be placed standing or lying. Fits with boxes and baskets.',
    brand: 'IKEA',
    category: 'Home',
    images: [
      'https://m.media-amazon.com/images/I/61MdvO9D+sL._SL1500_.jpg',
    ],
    price: 4999,
    discountPrice: 4499,
    discountPercent: 10,
    stock: 40,
    rating: 4.6,
    numReviews: 890,
    seller: 'IKEA India',
  },
  {
    name: 'Milton Thermosteel Flask 750ml',
    description:
      'Milton Thermosteel Flask keeps beverages hot for 24 hours and cold for 24 hours. Leak-proof lid, food-grade stainless steel.',
    brand: 'Milton',
    category: 'Home',
    images: [
      'https://rukminim2.flixcart.com/image/312/312/xif0q/bottle/i/e/r/-original-imaghsggfhxwxhdf.jpeg',
    ],
    price: 999,
    discountPrice: 699,
    discountPercent: 30,
    stock: 500,
    rating: 4.5,
    numReviews: 12300,
    seller: 'Milton India',
  },

  // ── Appliances ────────────────────────────────────────────────────────────────
  {
    name: 'Samsung 8 kg Fully Automatic Front Load Washing Machine',
    description:
      'EcoBubble technology, Digital Inverter Motor, Auto Restart, 1400 RPM spin speed, 15 wash programs, energy efficient 5-star rating.',
    brand: 'Samsung',
    category: 'Appliances',
    images: [
      'https://rukminim2.flixcart.com/image/312/312/xif0q/washing-machine-new/6/m/u/-original-imaghwdy3yzyyjjk.jpeg',
    ],
    price: 44990,
    discountPrice: 37490,
    discountPercent: 17,
    stock: 25,
    rating: 4.5,
    numReviews: 3200,
    seller: 'Samsung India Service',
  },
  {
    name: 'LG 1.5 Ton 5 Star Dual Inverter AC',
    description:
      'LG 1.5 Ton Dual Inverter Compressor AC with 4-way swing, auto-clean, Wi-Fi ThinQ control, 100% copper condenser, ISEER 5 star.',
    brand: 'LG',
    category: 'Appliances',
    images: [
      'https://rukminim2.flixcart.com/image/312/312/xif0q/air-conditioner-new/x/3/b/-original-imaghthbfyy8bfzz.jpeg',
    ],
    price: 55990,
    discountPrice: 44990,
    discountPercent: 20,
    stock: 18,
    rating: 4.6,
    numReviews: 4100,
    seller: 'LG Shoppe',
  },

  // ── Beauty ────────────────────────────────────────────────────────────────────
  {
    name: 'L\'Oreal Paris Revitalift Serum 30ml',
    description:
      '1.5% Hyaluronic Acid Serum for instant radiant skin, intense hydration, and reduced fine lines.',
    brand: 'L\'Oreal',
    category: 'Beauty',
    images: [
      'https://m.media-amazon.com/images/I/51y-fO54uXL._SL1000_.jpg',
    ],
    price: 999,
    discountPrice: 749,
    discountPercent: 25,
    stock: 150,
    rating: 4.4,
    numReviews: 5400,
    seller: 'L\'Oreal Beauty India',
  },

  // ── Sports ────────────────────────────────────────────────────────────────────
  {
    name: 'Yonex Muscle Power 29 Cricket Badminton Racket',
    description:
      'Isometric head shape, aluminum frame, graphite shaft for high tension stringing and powerful smashes.',
    brand: 'Yonex',
    category: 'Sports',
    images: [
      'https://m.media-amazon.com/images/I/61NfJz+j+xL._SL1500_.jpg',
    ],
    price: 2890,
    discountPrice: 1999,
    discountPercent: 30,
    stock: 80,
    rating: 4.5,
    numReviews: 1890,
    seller: 'Yonex Sports',
  },

  // ── Books ─────────────────────────────────────────────────────────────────────
  {
    name: 'Atomic Habits by James Clear',
    description:
      'An Easy & Proven Way to Build Good Habits & Break Bad Ones. Millions of copies sold worldwide.',
    brand: 'Penguin',
    category: 'Books',
    images: [
      'https://m.media-amazon.com/images/I/91bYsX41DVL._SL1500_.jpg',
    ],
    price: 799,
    discountPrice: 499,
    discountPercent: 37,
    stock: 400,
    rating: 4.8,
    numReviews: 24500,
    seller: 'Penguin Random House',
  },

  // ── Toys ──────────────────────────────────────────────────────────────────────
  {
    name: 'LEGO Classic Medium Creative Brick Box',
    description:
      '484 pieces including windows, eyes, wheels, and classic bricks in 35 different colors for creative building.',
    brand: 'LEGO',
    category: 'Toys',
    images: [
      'https://m.media-amazon.com/images/I/71wZ3s-6FKL._SL1500_.jpg',
    ],
    price: 3299,
    discountPrice: 2499,
    discountPercent: 24,
    stock: 65,
    rating: 4.7,
    numReviews: 3100,
    seller: 'LEGO Official Store',
  },

  // ── Grocery ───────────────────────────────────────────────────────────────────
  {
    name: 'Fortune Sunlite Refined Sunflower Oil (5 Litre Jar)',
    description:
      'Light and healthy sunflower oil rich in Vitamin E. High smoke point ideal for frying and daily cooking.',
    brand: 'Fortune',
    category: 'Grocery',
    images: [
      'https://m.media-amazon.com/images/I/61B+0s5mKqL._SL1500_.jpg',
    ],
    price: 850,
    discountPrice: 699,
    discountPercent: 17,
    stock: 300,
    rating: 4.6,
    numReviews: 15400,
    seller: 'Fortune Grocery',
  },
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/flipkart';
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      Cart.deleteMany({}),
    ]);
    console.log('✅ Existing data cleared.');

    // Create admin user — Hanuma
    const adminUser = await User.create({
      name: 'Hanuma',
      email: 'hanuma@flipkart.com',
      password: 'Hanuma@33',
      role: 'admin',
    });
    console.log(`👑 Admin user created: ${adminUser.email}`);

    // Create regular user — Sai
    const regularUser = await User.create({
      name: 'Sai',
      email: 'sai@flipkart.com',
      password: 'Sai123',
    });
    console.log(`👤 Regular user created: ${regularUser.email}`);

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`📦 ${createdProducts.length} products seeded across all categories.`);

    console.log('\n🎉 Database seeded successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
