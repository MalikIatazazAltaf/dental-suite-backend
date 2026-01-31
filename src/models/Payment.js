const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commonFields = require('./commonFields');

const paymentSchema = new Schema({
  ...commonFields,
  invoice_id: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['cash'], default: 'cash' },
  paid_at: { type: Date, default: Date.now },
  note: { type: String }
});

module.exports = mongoose.model('Payment', paymentSchema);
