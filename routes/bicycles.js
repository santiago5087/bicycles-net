var express = require('express');
var router = express.Router();
var bicycleController = require('../controllers/bicycle');

router.get('/', bicycleController.bicyclesList);
router.get('/read', bicycleController.bicyclesRead);
router.get('/create', bicycleController.bicyclesCreateGet);
router.post('/create', bicycleController.bicyclesCreatePost);
router.get('/:id/update', bicycleController.bicyclesUpdateGet);
router.post('/:id/update', bicycleController.bicyclesUpdatePost);
router.post('/:id/delete', bicycleController.bicyclesDelete);

module.exports = router;