const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Course', courseSchema);