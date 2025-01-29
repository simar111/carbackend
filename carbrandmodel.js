const mongoose = require('mongoose');

// Define the CarBrand schema with only the name field
const carBrandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

// Create the model from the schema
const CarBrand = mongoose.model('CarBrand', carBrandSchema);

module.exports = CarBrand;
