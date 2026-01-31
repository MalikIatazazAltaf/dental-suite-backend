const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commonFields = require('./commonFields');
const patientSchema = new Schema({
  ...commonFields,
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  notes_light: { type: String },
  last_visit_at: { type: Date } // optional denormalized
});

module.exports = mongoose.model('Patient', patientSchema);
