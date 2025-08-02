const Group = require('../models/Group');

// ✅ Create a group with notes
exports.createGroup = async (req, res) => {
  try {
    const { name, notes } = req.body;

    // Create group with name, notes, and createdBy fields
    const group = await Group.create({
      name,
      notes, // array of note IDs
      createdBy: req.user
    });

    const populatedGroup = await Group.findById(group._id).populate('notes');

    res.status(201).json(populatedGroup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create group with notes' });
  }
};

// ✅ Get all groups for a user
exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ createdBy: req.user }).populate('notes');
    res.status(200).json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get groups' });
  }
};

// ✅ Get group by ID
exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('notes');
    if (!group) return res.status(404).json({ message: 'Group not found' });
    res.json(group);
  } catch (err) {
    console.error("Error fetching group by ID:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Unified update: Update group name and notes at once
exports.updateGroup = async (req, res) => {
  try {
    const { name, notes } = req.body; // `notes` should be an array of note IDs

    const group = await Group.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user },
      { name, notes },
      { new: true }
    ).populate('notes');

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.status(200).json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update group' });
  }
};

// ✅ Delete a group
exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete group' });
  }
};
