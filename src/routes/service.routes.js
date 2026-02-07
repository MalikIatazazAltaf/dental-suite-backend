const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', protect, serviceController.getServices);
router.post('/', protect, serviceController.createService);
router.delete('/:id', protect, serviceController.softDeleteService);
module.exports = router;
