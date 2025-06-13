const express = require("express");
const router = express.Router();
const Enrollment = require("../models/enrollment-model");
const verifyToken = require("../auth/verifyToken");
const asyncHandler = require("../utils/asyncHandler");

// POST create a new enrollment (secured)
router.post(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const enrollment = new Enrollment(req.body);
    await enrollment.save();
    res.status(201).json(enrollment);
  })
);

// GET all enrollments (secured)
router.get(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const enrollments = await Enrollment.find()
      .populate("userId", "name email")
      .populate("courseId", "title description");
    res.json(enrollments);
  })
);

// GET enrollment by ID (secured)
router.get(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate("userId", "name email")
      .populate("courseId", "title description");
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });
    res.json(enrollment);
  })
);

// PUT update enrollment (secured)
router.put(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const updated = await Enrollment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Enrollment not found" });
    res.json(updated);
  })
);

// DELETE enrollment (secured)
router.delete(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const deleted = await Enrollment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Enrollment not found" });
    res.json({ message: "Enrollment deleted" });
  })
);

module.exports = router;
