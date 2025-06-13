const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const verifyToken = require('../auth/verifyToken'); // 🔐 Ajout du middleware JWT

// 🔎 Validation des champs
const userValidationRules = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Mot de passe trop court'),
  body('name').notEmpty().withMessage('Nom requis'),
  body('role').optional().isIn(['student', 'teacher', 'admin']).withMessage('Rôle invalide')
];

// 🔎 Middleware de validation
function validateUser(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// 🔹 GET /api/users
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// 🔹 PUT /api/users/:id
router.put('/:id', verifyToken, async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  userValidationRules,
  validateUser,
  async (req, res, next) => {

    try {
      const { email, password, name, role } = req.body;

      // Vérifie si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email déjà utilisé' });
      }

      // Hashage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Création de l'utilisateur
      const user = new User({
        email,
        password: hashedPassword,
        name,
        role: role || 'student' // Valeur par défaut
      });

      await user.save();

      // Réponse
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
