const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commonFields = require('./commonFields');

const invoiceItemSchema = new Schema({
  ...commonFields,
  invoice_id: { type: String, required: true },
  service_id: { type: String },
  description: { type: String },
  qty: { type: Number, required: true },
  unit_price: { type: Number, required: true },
  line_total: { type: Number, required: true }
});

module.exports = mongoose.model('InvoiceItem', invoiceItemSchema);
