const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commonFields = require('./commonFields');
const clinicSchema = new Schema({
  ...commonFields,
  name: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  logo_url: { type: String },
  timezone: { type: String },
  tax_enabled_default: { type: Boolean, default: false },
  receipt_footer_note: { type: String },
  working_hours: { type: Schema.Types.Mixed } // JSON
});

module.exports = mongoose.model('Clinic', clinicSchema);
