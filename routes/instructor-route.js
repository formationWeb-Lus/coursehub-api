const express = require('express');
const router = express.Router();
const Instructor = require('../models/instructor-model');
const { body, validationResult } = require('express-validator');
const { isAuthenticated } = require('../auth/oauth');

// Exemple de route sécurisée POST
router.post('/', isAuthenticated, async (req, res) => {
  // création d’un instructeur uniquement si connecté via GitHub
});

// Exemple de route sécurisée PUT
router.put('/:id', isAuthenticated, async (req, res) => {
  // modification possible uniquement si connecté
});


// GET all
router.get('/', async (req, res) => {
  try {
    const instructors = await Instructor.find();
    res.status(200).json(instructors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(instructor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST
router.post(
  '/',
  body('name').notEmpty().withMessage('Name is required'),
  body('expertise').notEmpty().withMessage('Expertise is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { name, expertise, bio } = req.body;
      const newInstructor = new Instructor({ name, expertise, bio });
      await newInstructor.save();
      res.status(201).json(newInstructor);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// PUT
router.put(
  '/:id',
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('expertise').optional().notEmpty().withMessage('Expertise cannot be empty'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const updated = await Instructor.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: 'Not found' });
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Instructor.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
