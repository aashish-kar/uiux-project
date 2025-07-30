import WishlistItem from '../models/wishlistItem.js';

export const getWishlist = async (req, res) => {
  try {
    const wishlistItems = await WishlistItem.find({ user: req.user.id }).populate('product');
    res.json(wishlistItems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if item already exists in wishlist
    const existingItem = await WishlistItem.findOne({ 
      user: req.user.id, 
      product: productId 
    });

    if (existingItem) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }

    const wishlistItem = new WishlistItem({
      user: req.user.id,
      product: productId
    });

    await wishlistItem.save();
    await wishlistItem.populate('product');
    res.status(201).json(wishlistItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { itemId } = req.params;
    const wishlistItem = await WishlistItem.findOneAndDelete({
      _id: itemId,
      user: req.user.id
    });

    if (!wishlistItem) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }

    res.json({ message: 'Item removed from wishlist' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
};

export const clearWishlist = async (req, res) => {
  try {
    await WishlistItem.deleteMany({ user: req.user.id });
    res.json({ message: 'Wishlist cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear wishlist' });
  }
};
