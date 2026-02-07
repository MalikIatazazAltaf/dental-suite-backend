const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/register', authController.register); // new register
router.get('/me', protect, authController.getMe);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
module.exports = router;
