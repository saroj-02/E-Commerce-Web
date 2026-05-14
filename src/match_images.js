const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const keywordToPhotoId = {
  "Laptop": "1496181133206-80ce9b88a853",
  "Smartphone": "1511707171634-5f897ff02aa9",
  "Buds": "1590658268037-6bf12165a8df",
  "Watch": "1523275335684-37898b6baf30",
  "Drone": "1473968512647-3e44a224fe8f",
  "Scarf": "1520903920243-00d872a2d1c9",
  "Gown": "1566174053879-31528523f8ae",
  "Bag": "1547949003-9792a18a2601",
  "Aviators": "1572635196237-14b3f281503f",
  "Cufflinks": "1617114919297-3c8ddb01f599",
  "Chair": "1586023492125-27b2c045efd7",
  "Table": "1533090161767-e6ffed986c88",
  "Diffuser": "1602928321679-560bb453f190",
  "Art": "1579783902614-a3fb3927b6a5",
  "Garden": "1585320806297-9794b3e4eeae",
  "Yoga": "1592419044706-39796d40f98c",
  "Bottle": "1602143399827-705204436220",
  "Blanket": "1580302200322-922650075e7a",
  "Espresso": "1510972527921-ce03766a1cf1",
  "Knife": "1593618998160-e34014e67546",
  "Turntable": "1539375665275-f9dd415ef9ac",
  "Pen": "1583485088034-697b5bc54ccd",
  "Journal": "1544816155-12df9643f363",
  "Projector": "1535016120720-40c646bebb9c",
  "Keyboard": "1511467687858-23d96c32e4ae",
  "Longboard": "1547447134-cd3f5c716030",
  "Guitar": "1510915361894-db8b60106cb1",
  "Telescope": "1583121274602-3e2820c69888",
  "Camera": "1526170315873-3a9861ea438a",
  "Tripod": "1452784444945-3f422708fe5e",
  "Cookware": "1584990344610-b26a629d813a",
  "Sheet": "1522771739844-6a9f6d5f14af",
  "Vase": "1581783898377-1c85bf937427",
  "Purifier": "1585771724684-2626fc486374",
  "Sunglasses": "1511499767390-a73c24639ad1",
  "Tie": "1589756823851-ede1be674188",
  "Boots": "1542281134-2195f2425f3c",
  "Backpack": "1553062407-98eeb64c6a62",
  "Bracelet": "1515562141207-7a88fb7ce338",
  "Gaming Chair": "1598550476439-6847785fce6d",
  "Desk": "1595515106969-1ce29566ff1c",
  "Sleeve": "1544333346-608528cc54f4",
  "SSD": "1597740985671-2a8a3b80502e",
  "Monitor Arm": "1547119957-630f9c31ad68",
  "Webcam": "1610483178736-9a1ae165381a",
  "Speaker": "1510972527921-ce03766a1cf1",
  "Headphones": "1505740420928-5e560c06d30e",
  "Mouse": "1527814050087-37a3d7769dfe",
  "Monitor": "1527443224154-c4a3942d3acf"
};

async function matchImagesToNames() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🍃 Connected to MongoDB to match specific images...');
    
    const products = await Product.find({});
    let count = 0;

    for (let p of products) {
      let foundId = null;
      
      // Check each keyword in the product name
      for (const [keyword, id] of Object.entries(keywordToPhotoId)) {
        if (p.name.toLowerCase().includes(keyword.toLowerCase())) {
          foundId = id;
          break;
        }
      }

      // If no name match, try category match
      if (!foundId) {
        if (p.category === 'Electronics') foundId = keywordToPhotoId["Laptop"];
        else if (p.category === 'Audio') foundId = keywordToPhotoId["Headphones"];
        else if (p.category === 'Fashion') foundId = keywordToPhotoId["Sunglasses"];
        else foundId = "1523275335684-37898b6baf30"; // Watch as ultimate fallback
      }

      p.image_url = `https://images.unsplash.com/photo-${foundId}?auto=format&fit=crop&q=80&w=800`;
      await p.save();
      count++;
    }

    console.log(`✅ Successfully matched ${count} product images with their specific names!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Match error:', err);
    process.exit(1);
  }
}

matchImagesToNames();
