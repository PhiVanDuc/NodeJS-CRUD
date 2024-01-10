var express = require('express');
var userController = require('../controllers/user.controller');
var router = express.Router();

router.get('/', userController.index);

router.get('/add', userController.add);
router.post('/add', userController.handleAdd);

router.get('/edit', userController.edit);
router.post('/edit', userController.handleEdit);

router.post('/delete', userController.handleDelete)

module.exports = router;