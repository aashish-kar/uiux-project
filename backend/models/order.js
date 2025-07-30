import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
  image: String,
  size: String,
  strapType: String, // Customization
  dialColor: String, // Customization
  engraving: String, // Customization
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  items: [orderItemSchema]
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
