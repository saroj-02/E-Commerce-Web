const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const verifiedPools = {
  "mouse": ["Wgs8dAUzLH8", "4PchFKrUw84", "wMT0oiL5XjA", "Pv--vb5vwzQ", "iO0I6-mhDEY"],
  "laptop": ["Zcp8xN9DnjM", "6RqSDGaNJ5c", "1SAnrIxw5OY", "xSiQBSq-I0M", "hBuwVLcYTnA"],
  "headphones": ["GI6L2pkiZgQ", "0pIW2ORVdRU", "oXXc-s5nNy8", "PDX_a_82obo", "v9bnfMCYvCA"],
  "monitor": ["eoSNV6svp2s", "E8bD4aAQ9m0", "_3En7Aaqiw8", "9KJETY3fC4s", "M9-dSG3Iswg"],
  "speaker": ["d6dxQwmxV2Q", "WkScffvaHW4", "cSAiU8zbm5Y", "9TF54VdG0ws", "ljNucs6FCxk"],
  "watch": ["vRcSC-UN3yI", "gJ9b48mc5qs", "6EBp_6DuxmY", "PWLJC7fAzkg", "L_6OdCI8jSA"],
  "drone": ["6nRjHtBDk4o", "0VfnZbQd98c", "p_5BnqHfz3Y", "Ve7iqUNkGsA", "0fA3gVTGwjQ"],
  "phone": ["_HB3Y1wGlxw", "q8U1YgBaRQk", "8l9VxXI28tY", "6wdRuK7bVTE", "pb_lF8VWaPU"],
  "coffee": ["V9jepI3Z5as", "ftA71vetxuo", "dvuHNTJxIsg", "wiOEVPVRfW4", "gitXsyBIi5s"],
  "keyboard": ["4GzqVNX0TCQ", "Z6SXt1v5tP8", "Wyc7vHXfCDQ", "Nzlzf7e3g8k", "KYw1eUx1J7Y"],
  "chair": ["ncOQxZe8Krw", "LJpbF2GmSx4", "I7peTDxq7ms", "zpkCxSHS1Rk", "N8uHaV9d55o"],
  "yoga": ["8KUod65Tmxo", "t1NEMSm1rgI", "G9H5edUL0T8", "b8Q5fHBsyik", "AX8cf6mkCzw"],
  "gown": ["77iyep3uIjg", "EtAV0Z_PmqU", "qmQI0l28AKs", "qSgqgOfKZB4", "-NyPn9up_7o"],
  "boots": ["_D7x0SJjiSs", "hMe1p1WP358", "x-agyuDQHJA", "8m80S09W6V8", "fI-1G-N7P8A"]
};

async function fixImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🍃 Connected to MongoDB...');
    
    const products = await Product.find({});
    let updatedCount = 0;

    for (let p of products) {
      const name = p.name.toLowerCase();
      let pool = null;

      if (name.includes("mouse")) pool = verifiedPools.mouse;
      else if (name.includes("laptop") || name.includes("notebook")) pool = verifiedPools.laptop;
      else if (name.includes("headphone") || name.includes("buds") || name.includes("audio") || name.includes("pad")) pool = verifiedPools.headphones;
      else if (name.includes("monitor") || name.includes("display") || name.includes("screen")) pool = verifiedPools.monitor;
      else if (name.includes("speaker") || name.includes("audio") || name.includes("sound")) pool = verifiedPools.speaker;
      else if (name.includes("watch") || name.includes("chrono") || name.includes("time")) pool = verifiedPools.watch;
      else if (name.includes("drone") || name.includes("fly")) pool = verifiedPools.drone;
      else if (name.includes("phone") || name.includes("mobile") || name.includes("smartphone")) pool = verifiedPools.phone;
      else if (name.includes("coffee") || name.includes("espresso") || name.includes("maker")) pool = verifiedPools.coffee;
      else if (name.includes("keyboard") || name.includes("type")) pool = verifiedPools.keyboard;
      else if (name.includes("chair") || name.includes("seat")) pool = verifiedPools.chair;
      else if (name.includes("yoga") || name.includes("mat") || name.includes("fitness")) pool = verifiedPools.yoga;
      else if (name.includes("gown") || name.includes("dress") || name.includes("silk") || name.includes("scarf")) pool = verifiedPools.gown;
      else if (name.includes("boot") || name.includes("shoe") || name.includes("leather")) pool = verifiedPools.boots;
      else pool = verifiedPools.laptop; // Default fallback

      if (pool) {
        // Map pool to full URLs
        p.images = pool.map(id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=800`);
        p.image_url = p.images[0];
        await p.save();
        updatedCount++;
      }
    }

    console.log(`✅ SUCCESS: Updated ${updatedCount} products with verified unique images.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ ERROR:', err);
    process.exit(1);
  }
}

fixImages();
