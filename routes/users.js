var express = require('express');
var userController = require('../controllers/user.controller');
var router = express.Router();

router.get('/', userController.index);

router.get('/add', userController.add);
router.post('/add', userController.handleAdd);

module.exports = router;