import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import addressesRouter from './routes/addresses.js';
import authRouter from './routes/auth.js';
import cartRouter from './routes/cart.js';
import contactRouter from './routes/contact.js';
import ordersRouter from './routes/orders.js';
import paymentMethodsRouter from './routes/paymentMethods.js';
import productsRouter from './routes/products.js';
import stripeRouter from './routes/stripe.js';
import usersRouter from './routes/users.js';
import wishlistRouter from './routes/wishlist.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173', 'http://192.168.222.1:8080'],
  credentials: true
}));
app.use(express.json());

// Example route for testing
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/stripe', stripeRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/addresses', addressesRouter);
app.use('/api/payment-methods', paymentMethodsRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/contact', contactRouter);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

export default app;
