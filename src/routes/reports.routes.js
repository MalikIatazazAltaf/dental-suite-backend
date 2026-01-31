const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reports.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/daily', protect, reportController.dailyReport);
router.get('/monthly', protect, reportController.monthlyReport);

module.exports = router;
