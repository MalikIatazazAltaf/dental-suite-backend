const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointments.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', protect, appointmentController.getAppointments);
router.post('/', protect, appointmentController.createAppointment);
router.post('/walkins', protect, appointmentController.createWalkin);
router.patch('/:id/status', protect, appointmentController.updateStatus);

module.exports = router;
