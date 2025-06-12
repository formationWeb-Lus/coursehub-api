const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// ✅ Middleware d'abord !
app.use(cors());
app.use(express.json()); // <-- Très important AVANT toutes les routes

// ✅ Ensuite les routes
app.use('/api/auth', authRoutes);

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    if (require.main === module) {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });

// Sessions & Passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Docs Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Autres routes
app.use('/instructors', require('./routes/instructor-route'));
app.use('/categories', require('./routes/category-route'));
app.use('/api/users', require('./routes/user-route'));
app.use('/api/courses', require('./routes/course-route'));
app.use('/api/enrollments', require('./routes/enrollment-route'));

// OAuth GitHub
const { router: oauthRouter } = require('./auth/oauth');
app.use('/api/auth', oauthRouter);

// Page d'accueil
app.get('/', (req, res) => {
  res.send('Welcome to WebAcademy API');
});

module.exports = app;
