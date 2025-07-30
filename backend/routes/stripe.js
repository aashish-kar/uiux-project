import express from 'express';
import { createPaymentIntent } from '../controllers/stripeController.js';

const router = express.Router();

router.post('/payment-intent', createPaymentIntent);

export default router; 