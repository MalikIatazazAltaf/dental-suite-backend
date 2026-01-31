const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commonFields = require('./commonFields');

const reminderSchema = new Schema({
  ...commonFields,
  patient_id: { type: String, required: true },
  type: { type: String, enum: ['follow_up', 'recall'], required: true },
  due_at: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'done', 'dismissed'], default: 'pending' },
  note: { type: String }
});

module.exports = mongoose.model('Reminder', reminderSchema);
