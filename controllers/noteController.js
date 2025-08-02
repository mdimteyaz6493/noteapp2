const Note = require('../models/Note');
const cloudinary = require('../config/cloudinary');

// Create Note
exports.createNote = async (req, res) => {
  try {
    const { title, content, group } = req.body;
    const images = [];

    // Upload files to Cloudinary
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'notes-images' },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });

        if (uploaded?.secure_url) {
          images.push(uploaded.secure_url);
        }
      }
    }

    const newNote = await Note.create({
      title,
      content,
      group,
      images,
      createdBy: req.user, // from auth middleware
    });

    res.status(201).json(newNote);
  } catch (err) {
    console.error("Create note error:", err);
    res.status(500).json({ message: 'Note creation failed' });
  }
};

// Get Notes for Logged-in User
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ createdBy: req.user }).populate("group");
    res.json(notes);
  } catch (err) {
    console.error("Get notes error:", err);
    res.status(500).json({ message: 'Failed to fetch notes' });
  }
};

// Update Note
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, group } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content, group },
      { new: true }
    );

    res.json(updatedNote);
  } catch (err) {
    console.error("Update note error:", err);
    res.status(500).json({ message: 'Failed to update note' });
  }
};

// Delete Note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    console.error("Delete note error:", err);
    res.status(500).json({ message: 'Failed to delete note' });
  }
};
