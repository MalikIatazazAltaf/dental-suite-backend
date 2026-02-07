const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/', protect, userController.createUser);
// GET clinic staff
router.get('/staff', protect, userController.getClinicStaff);
// enable / disable staff
router.patch('/staff/:userId/toggle-status', protect, userController.toggleUserStatus);

module.exports = router;
