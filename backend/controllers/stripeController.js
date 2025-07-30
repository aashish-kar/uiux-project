import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

// Only initialize Stripe if the API key is provided
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' })
  : null;

export const createPaymentIntent = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ error: 'Payment service not configured' });
    }
    
    const { amount, currency = 'usd' } = req.body;
    if (!amount) return res.status(400).json({ error: 'Amount is required' });
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      // You can add metadata or receipt_email here
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
}; 