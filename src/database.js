const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Product = require('./models/Product');
require('dotenv').config();

let mongoServer;

const startInMemoryMongo = async () => {
  mongoServer = await MongoMemoryServer.create();
  const memoryUri = mongoServer.getUri();
  await mongoose.connect(memoryUri);
  console.log('🍃 Connected to in-memory MongoDB');
};

const connectDb = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aura';

  try {
    await mongoose.connect(uri);
    console.log(`🍃 MongoDB Connected Successfully (${uri})`);
  } catch (err) {
    console.warn('⚠️ Primary MongoDB connection failed:', err.message);
    console.warn('⚠️ Falling back to in-memory MongoDB server');

    try {
      await startInMemoryMongo();
    } catch (memoryErr) {
      console.error('❌ In-memory MongoDB startup failed:', memoryErr.message);
      process.exit(1);
    }
  }

  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const seedProducts = [
        { name: 'Aura Chrono-Master', description: 'A luxury timepiece crafted for those who value precision and elegance.', price: 1299.99, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', category: 'Luxury', stock: 5 },
        { name: 'Aether S1 Wireless', description: 'Immersive audio experience with active noise cancellation and 40-hour battery life.', price: 349.99, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', category: 'Audio', stock: 15 },
        { name: 'Quantum Pro Laptop', description: 'Next-gen processor with 32GB RAM and 1TB SSD.', price: 2499.99, image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', category: 'Electronics', stock: 10 },
        { name: 'Midnight Silk Scarf', description: 'Hand-woven Italian silk with intricate patterns.', price: 180.0, image_url: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500', category: 'Fashion', stock: 20 },
        { name: 'Velvet Accent Chair', description: 'Plush velvet seating with mid-century modern legs.', price: 600.0, image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500', category: 'Home', stock: 10 },
        { name: 'Zen Yoga Mat', description: 'Eco-friendly non-slip grip for perfect balance.', price: 95.0, image_url: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=500', category: 'Wellness', stock: 100 },
        { name: 'Espresso Master X', description: 'Professional grade home espresso machine.', price: 1200.0, image_url: 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=500', category: 'Kitchen', stock: 5 },
        { name: 'Vintage Turntable', description: 'Belt-driven record player with modern Bluetooth output.', price: 299.0, image_url: 'https://images.unsplash.com/photo-1539375665275-f9dd415ef9ac?w=500', category: 'Audio', stock: 15 },
        { name: 'Nebula Gaming Mouse', description: 'Ultra-lightweight design with 26,000 DPI sensor.', price: 79.99, image_url: 'https://images.unsplash.com/photo-1527814050087-37a3d7769dfe?auto=format&fit=crop&q=80&w=400', category: 'Gaming', stock: 50 },
        { name: 'Zenith 4K Monitor', description: 'Edge-to-edge 32-inch 4K HDR display.', price: 649.99, image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400', category: 'Displays', stock: 10 }
      ];
      await Product.insertMany(seedProducts);
      console.log('📦 Database seeded with initial products');
    }
  } catch (seedErr) {
    console.error('❌ Database seed failed:', seedErr.message);
    process.exit(1);
  }
};

module.exports = { connectDb };

