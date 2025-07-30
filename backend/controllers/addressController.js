import Address from '../models/address.js';

export const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await Address.find({ userId });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
};

export const createAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, street, city, state, zip, isDefault } = req.body;
    const address = new Address({
      userId,
      type,
      street,
      city,
      state,
      zip,
      isDefault: !!isDefault
    });
    await address.save();
    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add address' });
  }
};
