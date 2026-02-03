const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  clinic_id: {
    type: String,
    required: true,
    unique: true,
    ref: 'Clinic'
  },
  seq: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Counter', counterSchema);
