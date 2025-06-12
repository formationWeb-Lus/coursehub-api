const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  duration: {
    type: Number,   // duration in minutes
    required: true,
    min: 1,
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  category: {
    type: String,
    required: false,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // ou 'Teacher' selon ta collection users
    required: true,
  },
  image: {
    type: String,
    required: false,
  }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
