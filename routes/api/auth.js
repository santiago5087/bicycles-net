var express = require('express');
var router = express.Router();
var authController = require('../../controllers/api/authControllerAPI');
var passport = require('passport');

router.post('/authenticate', authController.authenticate);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/facebook_token', passport.authenticate('facebook-token'), authController.authFacebookToken);

module.exports = router;