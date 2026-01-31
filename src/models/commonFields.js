// models/commonFields.js
const { v4: uuidv4 } = require('uuid');

const commonFields = {
  _id: { type: String, default: uuidv4 },
  clinic_id: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  created_by: { type: String, required: false }, // user_id
  is_deleted: { type: Boolean, default: false }
};

module.exports = commonFields;
