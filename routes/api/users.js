var express = require('express');
var router = express.Router();
var userController = require('../../controllers/api/userControllerAPI');

router.get('/', userController.user_list);
router.post('/create', userController.user_create);
router.post('/reserve', userController.user_reserve);

module.exports = router;