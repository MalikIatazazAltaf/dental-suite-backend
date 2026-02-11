const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commonFields = require('./commonFields');

const invoiceSchema = new Schema({
  ...commonFields,
  invoice_number: { type: String, required: true,unique: true}, // per clinic sequence
  patient_id: { type: String, required: true },
  appointment_id: { type: String },
  subtotal: { type: Number, required: true },
  discount_amount: { type: Number, default: 0 },
  tax_amount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  total_paid: { type: Number, default: 0 },
  balance_due: { type: Number, default: 0 },
  status: { type: String, enum: ['unpaid', 'partial', 'paid'], default: 'unpaid' },
  notes: { type: String }
});
// ✅ YAHAN ADD KARO (VERY IMPORTANT)
invoiceSchema.index(
  { clinic_id: 1, invoice_number: 1 },
  { unique: true }
);
invoiceSchema.pre(/^find/, function (next) {
  this.find({ is_deleted: false });
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
