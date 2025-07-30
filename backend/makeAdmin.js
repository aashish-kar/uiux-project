import mongoose from 'mongoose';
import User from './models/user.js';
import dotenv from 'dotenv';

dotenv.config();

const makeAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return;
    }

    user.role = 'admin';
    await user.save();
    console.log(`User ${email} is now an admin`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.log('Usage: node makeAdmin.js ass@gmail.com');
  process.exit(1);
}

makeAdmin(email); 