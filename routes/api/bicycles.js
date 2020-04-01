var express = require('express');
var router = express.Router();
var bicycleController = require('../../controllers/api/bicycleControllerAPI');

router.get('/', bicycleController.bicycle_list);
router.post('/create', bicycleController.bicycle_create);
router.delete('/:id', bicycleController.bicycle_delete);
router.put('/:id', bicycleController.bicycle_update);

module.exports = router;