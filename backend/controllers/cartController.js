import CartItem from '../models/cartItem.js';
import mongoose from 'mongoose';
import Product from '../models/product.js';

export const getCart = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const cartItems = await CartItem.find({ userId }).populate('productId');
    // Flatten product details into the cart item
    const result = cartItems.map(item => {
      const product = item.productId;
      if (!product) {
        // Optionally: remove this cart item from DB here
        return null; // skip this item
      }
      return {
        _id: item._id,
        productId: product._id,
        name: product.name,
        price: product.price,
        customPrice: item.customPrice,
        image: product.image,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        strapType: item.strapType,
        dialColor: item.dialColor,
        engraving: item.engraving,
        stock: product.stock
      };
    }).filter(Boolean); // Remove nulls
    res.json(result);
  } catch (err) {
    console.error('Error in getCart:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { productId, quantity, size, color, strapType, dialColor, engraving } = req.body;
    // Check product stock
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.stock <= 0) return res.status(400).json({ error: 'Product is out of stock' });
    // Calculate custom price
    let strapPrice = 0;
    if (strapType === 'steel') strapPrice = 5000;
    else if (strapType === 'silicone') strapPrice = 2000;
    else if (strapType === 'nato') strapPrice = 1500;
    let engravingPrice = engraving && engraving.trim() ? 3000 : 0;
    const customPrice = product.price + strapPrice + engravingPrice;
    let cartItem = await CartItem.findOne({ userId, productId, size, color, strapType, dialColor, engraving });
    if (cartItem) {
      // Check if adding would exceed stock
      if ((cartItem.quantity + (quantity || 1)) > product.stock) {
        return res.status(400).json({ error: 'Not enough stock available' });
      }
      cartItem.quantity += quantity || 1;
      cartItem.customPrice = customPrice;
      await cartItem.save();
    } else {
      if ((quantity || 1) > product.stock) {
        return res.status(400).json({ error: 'Not enough stock available' });
      }
      cartItem = new CartItem({ userId, productId, quantity: quantity || 1, size, color, strapType, dialColor, engraving, customPrice });
      await cartItem.save();
    }
    // Populate product details for the response
    await cartItem.populate('productId');
    const prod = cartItem.productId;
    res.status(201).json({
      _id: cartItem._id,
      productId: prod._id,
      name: prod.name,
      price: prod.price,
      customPrice: cartItem.customPrice,
      image: prod.image,
      quantity: cartItem.quantity,
      size: cartItem.size,
      color: cartItem.color,
      strapType: cartItem.strapType,
      dialColor: cartItem.dialColor,
      engraving: cartItem.engraving,
      stock: prod.stock
    });
  } catch (err) {
    res.status(400).json({ error: 'Failed to add to cart' });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { id } = req.params;
    const deleted = await CartItem.findOneAndDelete({ _id: id, userId });
    if (!deleted) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete cart item' });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { id } = req.params;
    const { quantity } = req.body;
    const updated = await CartItem.findOneAndUpdate(
      { _id: id, userId },
      { quantity },
      { new: true }
    ).populate('productId');
    if (!updated) return res.status(404).json({ error: 'Cart item not found' });
    const product = updated.productId;
    res.json({
      _id: updated._id,
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: updated.quantity,
      size: updated.size,
      color: updated.color,
      stock: product.stock
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    await CartItem.deleteMany({ userId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};
