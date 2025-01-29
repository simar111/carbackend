// usermodel.js
const mongoose = require('mongoose');

// Define the Contact schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
});

// Export the Contact model
module.exports = mongoose.model('Contact', contactSchema);
