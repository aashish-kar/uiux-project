import PaymentMethod from '../models/paymentMethod.js';

export const addPaymentMethod = async (req, res) => {
  try {
    const userId = req.user.id;
    const { brand, last4, expMonth, expYear } = req.body;
    const paymentMethod = new PaymentMethod({
      userId,
      brand,
      last4,
      expMonth,
      expYear
    });
    await paymentMethod.save();
    res.status(201).json(paymentMethod);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save payment method' });
  }
};

export const getUserPaymentMethods = async (req, res) => {
  try {
    const userId = req.user.id;
    const methods = await PaymentMethod.find({ userId }).sort({ createdAt: -1 });
    res.json(methods);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payment methods' });
  }
}; 