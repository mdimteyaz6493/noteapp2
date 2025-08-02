const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const groupController = require('../controllers/groupController');

router.get('/', auth, groupController.getGroups);
router.post('/create', auth, groupController.createGroup);
router.put('/:id', auth, groupController.updateGroup); // ✅ unified update
router.delete('/:id', auth, groupController.deleteGroup);
router.get('/:id', auth, groupController.getGroupById); // ✅ get one group

module.exports = router;
