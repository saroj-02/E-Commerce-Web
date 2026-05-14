const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const categoryImages = {
  "Electronics": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
  "Audio": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
  "Home": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
  "Fashion": "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80",
  "Luxury": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
  "Gaming": "https://images.unsplash.com/photo-1527814050087-37a3d7769dfe?w=800&q=80",
  "Displays": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
  "Wearables": "https://images.unsplash.com/photo-1544117518-30dd5f2f309d?w=800&q=80",
  "Accessories": "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80",
  "Wellness": "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=800&q=80",
  "Kitchen": "https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=800&q=80",
  "Music": "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80",
  "Photography": "https://images.unsplash.com/photo-1526170315873-3a9861ea438a?w=800&q=80",
  "Stationery": "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&q=80"
};

async function fixImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🍃 Connected to MongoDB to fix images...');
    
    const products = await Product.find({});
    let updatedCount = 0;

    for (let product of products) {
      // Check if it's currently using the "red cup" or a generic unsplash link
      if (product.image_url.includes('photo-1560393464-5c69a73c5770') || product.image_url.includes('unsplash.com/photo-')) {
        const newUrl = categoryImages[product.category] || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80";
        product.image_url = newUrl;
        await product.save();
        updatedCount++;
      }
    }

    console.log(`✅ Successfully updated ${updatedCount} product images with relevant, high-quality visuals!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Fix error:', err);
    process.exit(1);
  }
}

fixImages();
