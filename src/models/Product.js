const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image_url: { type: String },
  category: { type: String },
  stock: { type: Number, default: 10 },
  ratings: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 0 },
  features: [{ type: String }],
  images: [{ type: String }]
});

module.exports = mongoose.model('Product', ProductSchema);
