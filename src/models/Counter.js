const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  clinic_id: {
    type: mongoose.Schema.Types.ObjectId,
    // type: String,
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
