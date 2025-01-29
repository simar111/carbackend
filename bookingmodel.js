const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  carbrand: { type: String, required: true },
  cartype: { type: String, required: true },
  servicetype: { type: String, required: true },
  timing: { type: String, required: true },
  notes: { type: String }
});
module.exports = mongoose.model('Booking', bookingSchema);
