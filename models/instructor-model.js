const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  expertise: { type: String, required: true },
  bio: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Instructor', instructorSchema);
