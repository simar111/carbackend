const mongoose = require('mongoose');
const carTypeSchema = new mongoose.Schema({
  typename: {
    type: String,
    required: true,
    unique: true,
  },
});
const CarType = mongoose.model('CarType', carTypeSchema);
module.exports = CarType;
