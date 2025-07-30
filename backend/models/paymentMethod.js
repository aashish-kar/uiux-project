import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brand: { type: String, required: true },
  last4: { type: String, required: true },
  expMonth: { type: String },
  expYear: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);
export default PaymentMethod; 