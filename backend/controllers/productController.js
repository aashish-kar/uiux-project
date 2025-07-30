import Product from '../models/product.js';
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  try {
    // Handle multiple image uploads
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const upload = await cloudinary.uploader.upload(file.path, { folder: 'products' });
        imageUrls.push(upload.secure_url);
        fs.unlinkSync(file.path);
      }
    }
    // Fallback to single image field if no files uploaded
    let imageUrl = req.body.image;
    if (imageUrls.length > 0) {
      imageUrl = imageUrls[0];
    }

    // Process colors and sizes from comma-separated strings to arrays
    const productData = { ...req.body, image: imageUrl, images: imageUrls };
    
    // Convert colors string to array
    if (productData.colors && typeof productData.colors === 'string') {
      productData.colors = productData.colors.split(',').map(color => color.trim()).filter(color => color.length > 0);
    }
    
    // Convert sizes string to array
    if (productData.sizes && typeof productData.sizes === 'string') {
      productData.sizes = productData.sizes.split(',').map(size => size.trim()).filter(size => size.length > 0);
      }

    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Create product error:', err);
    res.status(400).json({ error: err.message || 'Failed to create product' });
  }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
  try {
    let updateData = { ...req.body };
    // Handle multiple image uploads
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const upload = await cloudinary.uploader.upload(file.path, { folder: 'products' });
        imageUrls.push(upload.secure_url);
        fs.unlinkSync(file.path);
      }
    }
    if (imageUrls.length > 0) {
      updateData.images = imageUrls;
      updateData.image = imageUrls[0]; // Set main image for backward compatibility
    }

    // Process colors and sizes from comma-separated strings to arrays
    if (updateData.colors && typeof updateData.colors === 'string') {
      updateData.colors = updateData.colors.split(',').map(color => color.trim()).filter(color => color.length > 0);
    }
    
    if (updateData.sizes && typeof updateData.sizes === 'string') {
      updateData.sizes = updateData.sizes.split(',').map(size => size.trim()).filter(size => size.length > 0);
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update product' });
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete product' });
  }
};

// Get a product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch product' });
  }
};
