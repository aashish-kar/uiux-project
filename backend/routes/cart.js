import express from 'express';
import { getCart, addToCart, deleteCartItem, updateCartItem, clearCart } from '../controllers/cartController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/', getCart);
router.post('/', addToCart);
router.delete('/:id', deleteCartItem);
router.put('/:id', updateCartItem);
router.post('/clear', clearCart);

export default router;
