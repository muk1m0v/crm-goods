const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const userController = require('../controllers/userController');

router.use(auth, admin);

router.get('/', userController.index);
router.get('/:id/edit', userController.showEdit);
router.post('/:id/update', userController.update);
router.post('/:id/delete', userController.delete);

module.exports = router;