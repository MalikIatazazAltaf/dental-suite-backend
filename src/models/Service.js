const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commonFields = require('./commonFields');
const serviceSchema = new Schema({
  ...commonFields,
  name: { type: String, required: true },
  default_fee: { type: Number, required: true },
  default_duration_minutes: { type: Number, required: true },
  is_active: { type: Boolean, default: true }
});
serviceSchema.pre(/^find/, function (next) {
  this.find({ is_deleted: false });
  next();
});

module.exports = mongoose.model('Service', serviceSchema);
