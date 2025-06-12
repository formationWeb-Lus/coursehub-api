const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// Configuration de la stratégie GitHub
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    // Tu peux sauvegarder l'utilisateur ici si tu veux
    return done(null, profile);
  }
));

// Sérialisation pour la session
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Middleware de vérification d'authentification
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: 'Non autorisé. Connecte-toi via GitHub.' });
}

// Routes OAuth

// Déclenche l'authentification GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback après authentification GitHub
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    const user = req.user;

    // Génère un token JWT avec id et username
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username || user.displayName || user.login
      },
      process.env.JWT_SECRET || 'monsecret123',
      { expiresIn: '1h' }
    );

    // Redirige vers /success en passant le token en query string
    res.redirect(`/api/auth/success?token=${token}`);
  }
);

// Affiche la page de succès avec le token JWT
router.get('/success', (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(401).send('Token manquant');
  }

  res.send(`
    <h1>✅ Connexion réussie avec GitHub</h1>
    <p>Voici ton token JWT :</p>
    <code style="background:#eee; padding: 10px; display: block; max-width: 100%; overflow-wrap: break-word;">Bearer ${token}</code>
    <p>Copie-le et colle-le dans Swagger dans "Authorize".</p>
  `);
});

module.exports = {
  router,
  isAuthenticated // export du middleware pour protéger tes routes
};
