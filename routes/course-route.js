const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Course = require('../models/course-model');
const verifyToken = require('../auth/verifyToken');

// Validation rules for POST and PUT
const courseValidationRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('duration').notEmpty().withMessage('Duration is required'),
  body('level').notEmpty().withMessage('Level is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('teacherId').isMongoId().withMessage('Teacher ID must be a valid Mongo ID')
];

// Middleware to check validation results
function validateCourse(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// 🔹 Create a new course (POST) - JWT protected + validation
router.post('/', verifyToken, courseValidationRules, validateCourse, async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Get all courses (GET) - public
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get a course by ID (GET) - public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Update a course (PUT) - JWT protected + validation
router.put('/:id', verifyToken, courseValidationRules, validateCourse, async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Course not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Delete a course (DELETE) - JWT protected
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
