const express = require('express');
const router = express.Router();
const Enrollment= require('../models/enrollment-model');

router.post('/', async (req, res) => {
  try {
    const enrollment = new Enrollment(req.body);
    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:studentId', async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.params.studentId });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Enrollment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
module.exports = router;
