const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// 🔐 À adapter selon ton modèle d'utilisateur réel
const User = require('../models/user-model'); // Assure-toi que ce modèle existe

// Route de connexion pour générer un token JWT
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Chercher l'utilisateur (à adapter selon ton système)
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Génération du token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'tonSecret',
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
