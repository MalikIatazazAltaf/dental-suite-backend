const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commonFields = require('./commonFields');
const userSchema = new Schema({
  ...commonFields,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['owner', 'receptionist', 'dentist'], required: true },
  password_hash: { type: String, required: true },
  is_active: { type: Boolean, default: true }
});

module.exports = mongoose.model('User', userSchema);
