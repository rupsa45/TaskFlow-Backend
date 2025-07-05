const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controllers.js');
const verifyToken = require('../middlewares/auth.middleware.js')

router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.get('/profile',verifyToken,authController.getProfile);
module.exports = router;