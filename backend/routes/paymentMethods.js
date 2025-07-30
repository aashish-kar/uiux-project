import express from 'express';
import auth from '../middleware/auth.js';
import { addPaymentMethod, getUserPaymentMethods } from '../controllers/paymentMethodController.js';

const router = express.Router();

router.use(auth);

router.get('/', getUserPaymentMethods);
router.post('/', addPaymentMethod);

export default router; 