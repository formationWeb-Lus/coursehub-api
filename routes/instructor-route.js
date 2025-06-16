const express = require('express');
const router = express.Router();
const Instructor = require('../models/instructor-model');
const { body, validationResult } = require('express-validator');
const verifyToken = require('../auth/verifyToken');
const asyncHandler = require('../utils/asyncHandler');

// 🔹 GET all instructors (public)
router.get('/', asyncHandler(async (req, res) => {
  const instructors = await Instructor.find();
  res.status(200).json(instructors);
}));

// 🔹 GET instructor by ID (public)
router.get('/:id', asyncHandler(async (req, res) => {
  const instructor = await Instructor.findById(req.params.id);
  if (!instructor) return res.status(404).json({ message: 'Instructor not found' });
  res.status(200).json(instructor);
}));

// 🔐 POST create instructor (secured)
router.post(
  '/',
  verifyToken, // 🔐 Auth only here
  body('name').notEmpty().withMessage('Name is required'),
  body('expertise').notEmpty().withMessage('Expertise is required'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, expertise, bio } = req.body;
    const newInstructor = new Instructor({ name, expertise, bio });
    await newInstructor.save();
    res.status(201).json(newInstructor);
  })
);

// 🔐 PUT update instructor (secured)
router.put(
  '/:id',
  verifyToken, // 🔐 Auth only here
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('expertise').optional().notEmpty().withMessage('Expertise cannot be empty'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const updated = await Instructor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Instructor not found' });
    res.status(200).json(updated);
  })
);

// 🔓 DELETE instructor (public)
router.delete('/:id', asyncHandler(async (req, res) => {
  const deleted = await Instructor.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Instructor not found' });
  res.status(200).json({ message: 'Deleted successfully' });
}));

module.exports = router;
