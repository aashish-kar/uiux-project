import { createProduct } from '../controllers/productController.js';
import { adminAuth } from '../middleware/auth.js';

router.post('/products', adminAuth, createProduct);
