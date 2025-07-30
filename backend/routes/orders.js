import express from 'express';
import auth from '../middleware/auth.js';
import { getUserOrders, createOrder, getAllOrders, updateOrderStatus, deleteOrder } from '../controllers/orderController.js';

const router = express.Router();

router.use(auth);

router.get('/', getUserOrders);
router.get('/all', getAllOrders);
router.post('/', createOrder);
router.put('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

export default router;
