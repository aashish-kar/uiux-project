import express from 'express';
import auth from '../middleware/auth.js';
import { getWishlist, addToWishlist, removeFromWishlist, clearWishlist } from '../controllers/wishlistController.js';

const router = express.Router();

// All wishlist routes require authentication
router.use(auth);

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:itemId', removeFromWishlist);
router.delete('/', clearWishlist);

export default router;
