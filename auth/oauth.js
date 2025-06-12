const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const express = require('express');
const router = express.Router();
require('dotenv').config();

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
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/api/auth/success');
  }
);

router.get('/success', (req, res) => {
  if (!req.user) {
    return res.status(401).send('Non authentifié');
  }
  res.send(`Bienvenue ${req.user.username}`);
});

module.exports = {
  router,
  isAuthenticated // ✅ export du middleware ici
};
