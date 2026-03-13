// const mongoose = require('mongoose');

// const counterSchema = new mongoose.Schema({
//   clinic_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     // type: String,
//     required: true,
//     unique: true,
//     ref: 'Clinic'
//   },
//   seq: {
//     type: Number,
//     default: 0
//   }
// });

// module.exports = mongoose.model('Counter', counterSchema);

const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  clinic_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    default: 0
  }
});

counterSchema.index({ clinic_id: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Counter", counterSchema);

