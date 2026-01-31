const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patients.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', protect, patientController.getPatients); // search, pagination
router.post('/', protect, patientController.createPatient);
router.get('/:id', protect, patientController.getPatientById);

module.exports = router;
