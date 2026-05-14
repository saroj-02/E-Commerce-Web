const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const moreProducts = [
  // Tech & Electronics
  { name: "Quantum Pro Laptop", description: "Next-gen processor with 32GB RAM and 1TB SSD.", price: 2499.99, image_url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500", category: "Electronics", stock: 10 },
  { name: "Prism Smartphone", description: "Revolutionary camera system with folding display.", price: 1199.99, image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500", category: "Electronics", stock: 25 },
  { name: "Sonic Buds Elite", description: "Studio-quality sound in a compact wireless form.", price: 249.99, image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500", category: "Audio", stock: 40 },
  { name: "Titan Smartwatch", description: "Rugged design with sapphire glass and 10-day battery.", price: 499.99, image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", category: "Wearables", stock: 15 },
  { name: "Apex Drone X5", description: "4K video recording with 30-minute flight time.", price: 899.99, image_url: "https://images.unsplash.com/photo-1473968512647-3e44a224fe8f?w=500", category: "Electronics", stock: 8 },
  
  // Luxury & Fashion
  { name: "Midnight Silk Scarf", description: "Hand-woven Italian silk with intricate patterns.", price: 180.00, image_url: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500", category: "Fashion", stock: 20 },
  { name: "Saphire Evening Gown", description: "Elegant floor-length gown for the most exclusive events.", price: 1500.00, image_url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500", category: "Fashion", stock: 5 },
  { name: "Leather Weekender Bag", description: "Premium full-grain leather for stylish travels.", price: 450.00, image_url: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500", category: "Accessories", stock: 12 },
  { name: "Classic Aviators", description: "Polarized lenses with lightweight titanium frames.", price: 220.00, image_url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500", category: "Accessories", stock: 30 },
  { name: "Onyx Cufflinks", description: "Sterling silver with polished onyx inlay.", price: 120.00, image_url: "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=500", category: "Luxury", stock: 25 },

  // Home & Decor
  { name: "Velvet Accent Chair", description: "Plush velvet seating with mid-century modern legs.", price: 600.00, image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500", category: "Home", stock: 10 },
  { name: "Marble Coffee Table", description: "Genuine Carrara marble top with brass base.", price: 850.00, image_url: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=500", category: "Home", stock: 7 },
  { name: "Aroma Diffuser Pro", description: "Ultrasonic technology with customizable LED lighting.", price: 85.00, image_url: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=500", category: "Home", stock: 50 },
  { name: "Abstract Canvas Art", description: "Hand-painted large-scale abstract masterpiece.", price: 400.00, image_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500", category: "Art", stock: 3 },
  { name: "Smart Garden Kit", description: "Automated indoor gardening for fresh herbs year-round.", price: 150.00, image_url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500", category: "Home", stock: 20 },

  // Lifestyle & Wellness
  { name: "Zen Yoga Mat", description: "Eco-friendly non-slip grip for perfect balance.", price: 95.00, image_url: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=500", category: "Wellness", stock: 100 },
  { name: "Hydra Glass Bottle", description: "Borosilicate glass with protective silicone sleeve.", price: 45.00, image_url: "https://images.unsplash.com/photo-1602143399827-705204436220?w=500", category: "Lifestyle", stock: 60 },
  { name: "Weighted Calm Blanket", description: "15lb weighted blanket for improved sleep quality.", price: 180.00, image_url: "https://images.unsplash.com/photo-1580302200322-922650075e7a?w=500", category: "Wellness", stock: 15 },
  { name: "Espresso Master X", description: "Professional grade home espresso machine.", price: 1200.00, image_url: "https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=500", category: "Kitchen", stock: 5 },
  { name: "Gourmet Knife Set", description: "Damascus steel knives with ergonomic handles.", price: 350.00, image_url: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500", category: "Kitchen", stock: 10 },

  // More Random Cool Stuff
  { name: "Vintage Turntable", description: "Belt-driven record player with modern Bluetooth output.", price: 299.00, image_url: "https://images.unsplash.com/photo-1539375665275-f9dd415ef9ac?w=500", category: "Audio", stock: 15 },
  { name: "Classic Fountain Pen", description: "Gold-plated nib with refillable ink converter.", price: 150.00, image_url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500", category: "Stationery", stock: 40 },
  { name: "Leather Journal", description: "Refillable notebook with premium cream paper.", price: 55.00, image_url: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500", category: "Stationery", stock: 80 },
  { name: "Compact Projector", description: "Full HD portable cinema for your living room.", price: 450.00, image_url: "https://images.unsplash.com/photo-1535016120720-40c646bebb9c?w=500", category: "Electronics", stock: 10 },
  { name: "Mechanical Keyboard", description: "RGB backlit with tactile blue switches.", price: 130.00, image_url: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500", category: "Gaming", stock: 25 },
  { name: "Electric Longboard", description: "Dual motor drive with 20-mile range.", price: 750.00, image_url: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=500", category: "Sports", stock: 5 },
  { name: "Acoustic Guitar", description: "Solid spruce top with rich, warm resonance.", price: 550.00, image_url: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500", category: "Music", stock: 8 },
  { name: "Telescope Explorer", description: "Powerful zoom for backyard stargazing.", price: 400.00, image_url: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500", category: "Science", stock: 12 },
  { name: "Polaroid Camera", description: "Instantly capture and print your memories.", price: 120.00, image_url: "https://images.unsplash.com/photo-1526170315873-3a9861ea438a?w=500", category: "Photography", stock: 35 },
  { name: "Professional Tripod", description: "Carbon fiber build with 360-degree ball head.", price: 210.00, image_url: "https://images.unsplash.com/photo-1452784444945-3f422708fe5e?w=500", category: "Photography", stock: 20 },
  { name: "Copper Cookware", description: "5-piece set for superior heat distribution.", price: 450.00, image_url: "https://images.unsplash.com/photo-1584990344610-b26a629d813a?w=500", category: "Kitchen", stock: 6 },
  { name: "Bamboo Sheet Set", description: "Silky soft and naturally hypoallergenic.", price: 140.00, image_url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500", category: "Home", stock: 50 },
  { name: "Ceramic Vase Set", description: "Minimalist duo for any modern shelf.", price: 75.00, image_url: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500", category: "Home", stock: 30 },
  { name: "Wool Throw Blanket", description: "Cozy warmth for chilly evenings.", price: 120.00, image_url: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=500", category: "Home", stock: 40 },
  { name: "Air Purifier Pro", description: "HEPA filter for cleaner, fresher indoor air.", price: 250.00, image_url: "https://images.unsplash.com/photo-1585771724684-2626fc486374?w=500", category: "Home", stock: 15 },
  { name: "Designer Sunglasses", description: "Bold frames with luxury craftsmanship.", price: 350.00, image_url: "https://images.unsplash.com/photo-1511499767390-a73c24639ad1?w=500", category: "Fashion", stock: 10 },
  { name: "Silk Tie Collection", description: "Set of three premium silk ties.", price: 150.00, image_url: "https://images.unsplash.com/photo-1589756823851-ede1be674188?w=500", category: "Fashion", stock: 20 },
  { name: "Leather Chelsea Boots", description: "Timeless style with durable construction.", price: 280.00, image_url: "https://images.unsplash.com/photo-1542281134-2195f2425f3c?w=500", category: "Fashion", stock: 15 },
  { name: "Canvas Backpack", description: "Rugged design for daily urban adventures.", price: 95.00, image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500", category: "Accessories", stock: 45 },
  { name: "Silver Link Bracelet", description: "Elegant minimalism for everyday wear.", price: 180.00, image_url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500", category: "Luxury", stock: 25 },
  { name: "Drone Propeller Guard", description: "Essential protection for your drone flights.", price: 25.00, image_url: "https://images.unsplash.com/photo-1506947411487-a56738267384?w=500", category: "Electronics", stock: 100 },
  { name: "USB-C Hub Elite", description: "10-in-1 expansion for your workstation.", price: 85.00, image_url: "https://images.unsplash.com/photo-1563770660941-20978e870e9b?w=500", category: "Electronics", stock: 60 },
  { name: "Noise Isolating Pads", description: "Replacement pads for Aether headphones.", price: 35.00, image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", category: "Audio", stock: 50 },
  { name: "Gaming Chair Pro", description: "Ergonomic comfort for long gaming sessions.", price: 450.00, image_url: "https://images.unsplash.com/photo-1598550476439-6847785fce6d?w=500", category: "Gaming", stock: 10 },
  { name: "Standing Desk", description: "Motorized height adjustment for productivity.", price: 550.00, image_url: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=500", category: "Home Tech", stock: 8 },
  { name: "Laptop Sleeve", description: "Water-resistant protection with soft lining.", price: 40.00, image_url: "https://images.unsplash.com/photo-1544333346-608528cc54f4?w=500", category: "Accessories", stock: 80 },
  { name: "External SSD 2TB", description: "Ultra-fast storage for creative pros.", price: 220.00, image_url: "https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?w=500", category: "Electronics", stock: 30 },
  { name: "Monitor Arm", description: "Fully adjustable mount for dual monitors.", price: 120.00, image_url: "https://images.unsplash.com/photo-1547119957-630f9c31ad68?w=500", category: "Displays", stock: 25 },
  { name: "Webcam 4K", description: "Crystal clear video for streaming and calls.", price: 180.00, image_url: "https://images.unsplash.com/photo-1610483178736-9a1ae165381a?w=500", category: "Electronics", stock: 40 },
  { name: "Microphone Arm", description: "Studio-grade boom arm for your setup.", price: 65.00, image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500", category: "Audio", stock: 30 }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🍃 Connected to MongoDB for seeding...');
    
    // Optional: Clear existing products if you want a clean slate
    // await Product.deleteMany({});
    
    await Product.insertMany(moreProducts);
    console.log(`📦 Successfully added ${moreProducts.length} new products!`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();
