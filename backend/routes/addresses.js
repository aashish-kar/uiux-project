import express from 'express';
import auth from '../middleware/auth.js';
import { getUserAddresses, createAddress } from '../controllers/addressController.js';

const router = express.Router();

router.use(auth);

router.get('/', getUserAddresses);
router.post('/', createAddress);

export default router;
