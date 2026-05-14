const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const pool = {
  laptop: [
    "1496181133206-80ce9b88a853", // Standard Laptop
    "1593642632823-8f785ba67e45", // Dell/Workstation
    "1588872657578-7c1e6c5500c6"  // Creative Laptop
  ],
  smartphone: [
    "1511707171634-5f897ff02aa9", // White Phone
    "1512941937669-90a1b58e7e9c", // Red Phone
    "1551817419-f538740f9000"  // Pro Phone
  ],
  audio: [
    "1505740420928-5e560c06d30e", // Headphones
    "1590658268037-6bf12165a8df", // Earbuds
    "1539375665275-f9dd415ef9ac"  // Speaker/Turntable
  ],
  watch: [
    "1523275335684-37898b6baf30", // Watch Gold
    "1508685096489-723506260661", // Watch Black
    "1542496658-133adcc8c7a3"  // Watch Modern
  ],
  drone: [
    "1473968512647-3e44a224fe8f", // Drone Sky
    "1508614589041-895b9ec9302c", // Drone Ground
    "1506947411487-a56738267384"  // Drone Close
  ],
  gaming: [
    "1615663248861-27d29d0ca9ac", // Gaming Mouse
    "1587829741301-dc798b83dadc", // Gaming Keyboard
    "1527443224154-c4a3942d3acf"  // Gaming Monitor
  ],
  fashion: [
    "1520903920243-00d872a2d1c9", // Silk
    "1566174053879-31528523f8ae", // Gown
    "1515886657613-9f3515b0c78f"  // Fashion Model
  ],
  furniture: [
    "1567538096630-e0c55bd6374c", // Chair
    "1518455027359-f3f8164ba6bd", // Desk
    "1533090161767-e6ffed986c88"  // Table
  ],
  wellness: [
    "1592419044706-39796d40f98c", // Yoga
    "1602928321679-560bb453f190", // Diffuser
    "1602143399827-705204436220"  // Bottle
  ],
  camera: [
    "1516035069171-4619d796bb04", // Pro Camera
    "1526170315873-3a9861ea438a", // Polaroid
    "1452784444945-3f422708fe5e"  // Tripod
  ],
  lifestyle: [
    "1547447134-cd3f5c716030", // Longboard
    "1583121274602-3e2820c69888", // Telescope
    "1510915361894"  // Guitar (numeric)
  ]
};

const keywordMap = [
  { kw: "microphone", pool: "audio" },
  { kw: "mouse", pool: "gaming" },
  { kw: "keyboard", pool: "gaming" },
  { kw: "monitor", pool: "gaming" },
  { kw: "laptop", pool: "laptop" },
  { kw: "notebook", pool: "laptop" },
  { kw: "phone", pool: "smartphone" },
  { kw: "mobile", pool: "smartphone" },
  { kw: "watch", pool: "watch" },
  { kw: "chrono", pool: "watch" },
  { kw: "drone", pool: "drone" },
  { kw: "buds", pool: "audio" },
  { kw: "headphone", pool: "audio" },
  { kw: "speaker", pool: "audio" },
  { kw: "chair", pool: "furniture" },
  { kw: "desk", pool: "furniture" },
  { kw: "table", pool: "furniture" },
  { kw: "yoga", pool: "wellness" },
  { kw: "diffuser", pool: "wellness" },
  { kw: "camera", pool: "camera" },
  { kw: "guitar", pool: "lifestyle" },
  { kw: "gown", pool: "fashion" },
  { kw: "dress", pool: "fashion" },
  { kw: "silk", pool: "fashion" }
];

async function fix() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🍃 Connected for FINAL fix...');
    
    const products = await Product.find({});
    for (let p of products) {
      const name = p.name.toLowerCase();
      let match = keywordMap.find(m => name.includes(m.kw));
      let poolKey = match ? match.pool : null;

      if (!poolKey) {
        if (p.category === 'Electronics') poolKey = "laptop";
        else if (p.category === 'Audio') poolKey = "audio";
        else if (p.category === 'Fashion') poolKey = "fashion";
        else if (p.category === 'Home') poolKey = "furniture";
        else if (p.category === 'Gaming') poolKey = "gaming";
        else poolKey = "lifestyle";
      }

      const selectedPool = pool[poolKey] || pool.lifestyle;
      
      // Assign images
      p.images = selectedPool.map(id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=800`);
      p.image_url = p.images[0];
      
      await p.save();
      console.log(`✅ ${p.name} -> ${poolKey}`);
    }
    console.log('🚀 Done!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fix();
