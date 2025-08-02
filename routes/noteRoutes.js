const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createNote,
  getNotes,
  updateNote,
  deleteNote
} = require('../controllers/noteController');

const router = express.Router();

router.get('/', auth, getNotes); // Fetch notes for authenticated user
router.post('/', auth, upload.array('images'), createNote); // Upload multiple images
router.put('/:id', auth, updateNote); // Update note
router.delete('/:id', auth, deleteNote); // Delete note

module.exports = router;
