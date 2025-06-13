const express = require('express');
const { body, validationResult } = require('express-validator');
const Course = require('../models/course-model');
const verifyToken = require('../auth/verifyToken');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');

const router = express.Router();

// ✅ Règles de validation pour POST et PUT
const courseValidationRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('duration').notEmpty().withMessage('Duration is required'),
  body('level').notEmpty().withMessage('Level is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('teacherId').isMongoId().withMessage('Teacher ID must be a valid Mongo ID')
];

// ✅ Middleware de validation
function validateCourse(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = errors.array();
    return next(error);
  }
  next();
}

// 🔹 Créer un cours
router.post(
  '/',
  verifyToken,
  courseValidationRules,
  validateCourse,
  asyncHandler(async (req, res) => {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  })
);

function validateObjectId(req, res, next) {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  next();
}

// 🔹 Obtenir tous les cours avec pagination
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const courses = await Course.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Course.countDocuments();
    res.json({ total, page: Number(page), courses });
  })
);


// Route GET /api/courses/:id
router.get('/:id', async (req, res, next) => {
  try {
    const courseId = req.params.id;

    // Vérification de la validité de l'ID MongoDB
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      const error = new Error('Invalid course ID format');
      error.statusCode = 400;
      throw error;
    }

    const course = await Course.findById(courseId);
    if (!course) {
      const error = new Error('Course not found');
      error.statusCode = 404;
      throw error;
    }

    res.json(course);
  } catch (err) {
    next(err);
  }
});

// 🔹 Modifier un cours
router.put(
  '/:id',
  verifyToken,
  courseValidationRules,
  validateCourse,
  asyncHandler(async (req, res) => {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      const error = new Error('Course not found');
      error.statusCode = 404;
      throw error;
    }
    res.json(updated);
  })
);

// 🔹 Supprimer un cours
router.delete(
  '/:id',
  verifyToken,
  asyncHandler(async (req, res) => {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) {
      const error = new Error('Course not found');
      error.statusCode = 404;
      throw error;
    }
    res.json({ message: 'Course deleted' });
  })
);

module.exports = router;

