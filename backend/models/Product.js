const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  sku: { type: String, unique: true, sparse: true },
  color: String,
  size: String,
  price: Number,
  stock: { type: Number, default: 0, min: 0 },
  images: [String]
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: String,
  shortDescription: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: Number,
  images: [String],
  specifications: { type: Map, of: String },
  variants: [variantSchema],
  stock: { type: Number, default: 0, min: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
