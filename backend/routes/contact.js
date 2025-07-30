import express from 'express';
import { createContact, getContacts, deleteContact } from '../controllers/contactController.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// POST /api/contact - public
router.post('/', createContact);

// GET /api/contact - admin only
router.get('/', adminAuth, getContacts);

// DELETE /api/contact/:id - admin only
router.delete('/:id', adminAuth, deleteContact);

export default router; 