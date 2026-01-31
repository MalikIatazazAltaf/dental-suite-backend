const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commonFields = require('./commonFields');

const appointmentSchema = new Schema({
  ...commonFields,
  patient_id: { type: String, required: true },
  dentist_id: { type: String, required: true },
  service_id: { type: String, required: true },
  start_at: { type: Date, required: true },
  end_at: { type: Date, required: true },
  fee_snapshot: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['booked', 'arrived', 'in_chair', 'completed', 'no_show', 'cancelled'],
    default: 'booked'
  },
  source: { type: String, enum: ['scheduled', 'walk_in'], default: 'scheduled' },
  token_number: { type: String },
  notes_light: { type: String }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
