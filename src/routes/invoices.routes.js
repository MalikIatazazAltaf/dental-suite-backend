const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoices.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/', protect, invoiceController.createInvoice);
router.get('/', protect, invoiceController.getInvoices);
router.get('/:id/receipt-pdf', protect, invoiceController.getReceiptPDF);

router.delete('/:id', protect, invoiceController.softDeleteInvoice);

module.exports = router;
