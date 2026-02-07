const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commonFields = require('./commonFields');
const userSchema = new Schema({
  ...commonFields,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['owner', 'receptionist', 'dentist'], required: true },
  password_hash: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  is_verified: {
  type: Boolean,
  default: false
},
email_verification_token: {
  type: String
},
email_verification_expires: {
  type: Date
},
reset_password_token: String,
reset_password_expires: Date
});



module.exports = mongoose.model('User', userSchema);
