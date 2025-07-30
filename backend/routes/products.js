import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct, getProductById } from '../controllers/productController.js';
import { adminAuth } from '../middleware/auth.js';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// GET /api/products - Public access
router.get('/', getProducts);

// POST /api/products - Admin only
router.post('/', upload.array('images', 4), createProduct);

// PUT /api/products/:id - Admin only
router.put('/:id', upload.array('images', 4), updateProduct);

// DELETE /api/products/:id - Admin only
router.delete('/:id', adminAuth, deleteProduct);

// GET /api/products/:id - Public access
router.get('/:id', getProductById);

export default router;
