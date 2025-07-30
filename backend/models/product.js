import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: { type: String, default: 'https://res.cloudinary.com/demo/image/upload/v1690000000/default-product.png' },
  images: [{ type: String }], // New field for multiple images
  category: String,
  brand: String,
  colors: [String],
  sizes: [String],
  inStock: { type: Boolean, default: true },
  rating: Number,
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  featured: { type: Boolean, default: false }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
