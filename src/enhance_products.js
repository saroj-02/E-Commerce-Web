const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const categoryMapping = {
  "Electronics": "1496181133206-80ce9b88a853",
  "Audio": "1505740420928-5e560c06d30e",
  "Home": "1586023492125-27b2c045efd7",
  "Fashion": "1520903920243-00d872a2d1c9",
  "Luxury": "1523275335684-37898b6baf30",
  "Gaming": "1527814050087-37a3d7769dfe",
  "Displays": "1527443224154-c4a3942d3acf",
  "Wearables": "1544117518-30dd5f2f309d",
  "Accessories": "1547949003-9792a18a2601",
  "Wellness": "1592419044706-39796d40f98c",
  "Kitchen": "1510972527921-ce03766a1cf1",
  "Music": "1510915361894-db8b60106cb1",
  "Photography": "1526170315873-3a9861ea438a",
  "Stationery": "1583485088034-697b5bc54ccd"
};

async function fixBrokenImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🍃 Connected to MongoDB to fix modal images...');
    
    const products = await Product.find({});
    let count = 0;

    for (let p of products) {
      // Use the specific ID if category matches, else use a good generic luxury ID
      const photoId = categoryMapping[p.category] || "1523275335684-37898b6baf30";
      p.image_url = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=800`;
      
      // Also ensure descriptions are more "e-commerce" like
      if (p.description.length < 50) {
        p.description = `${p.description} Designed with the modern professional in mind, this piece combines state-of-the-art functionality with the timeless aesthetic of the AURA collection.`;
      }

      await p.save();
      count++;
    }

    console.log(`✅ Fixed ${count} product images with reliable URLs!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Fix error:', err);
    process.exit(1);
  }
}

fixBrokenImages();
