import Contact from '../models/contact.js';

// Create a new contact message
export const createContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    res.status(400).json({ error: 'Failed to submit contact message' });
  }
};

// Get all contact messages (admin)
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
};

// Delete a contact message by ID (admin)
export const deleteContact = async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Contact message not found' });
    res.json({ message: 'Contact message deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete contact message' });
  }
}; 