import User from '../models/user.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-passwordHash'); // Exclude passwordHash
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Update user profile (for authenticated user)
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // req.user should be set by auth middleware
    const { firstName, lastName, dateOfBirth, phone } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, dateOfBirth, phone, updatedAt: Date.now() },
      { new: true }
    ).select('-passwordHash');
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user profile' });
  }
};

// Get authenticated user's profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};
