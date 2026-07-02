const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const parcelController = require('../controllers/parcelController');

// Все маршруты требуют аутентификации
router.use(auth);

// Список посылок – доступен всем
router.get('/', parcelController.index);

// Создание, редактирование, удаление – только админ
router.get('/new', admin, parcelController.showNew);
router.post('/', admin, parcelController.create);
router.get('/:id/edit', admin, parcelController.showEdit);
router.post('/:id/update', admin, parcelController.update);
router.post('/:id/delete', admin, parcelController.delete);

module.exports = router;