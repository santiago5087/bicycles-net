var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');

router.get('/', userController.userList);
router.get('/create', userController.userCreateGet);
router.post('/create', userController.userCreatePost);
router.post('/:id/delete', userController.userDelete);

module.exports = router;