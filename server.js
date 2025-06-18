const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
require('dotenv').config();

const session = require("express-session");
const passport = require("passport");
require("./config/passport");

const app = express();

// ===== MIDDLEWARE SESSIONS & PASSPORT =====
app.use(session({
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// ===== MIDDLEWARES GLOBAUX =====
app.use(cors());
app.use(express.json());

// ===== IMPORT DES ROUTES =====
const authRoutes = require('./routes/authRoutes'); // contient login, register, et Google OAuth
const courseRoutes = require('./routes/course-route');
const categoryRoutes = require('./routes/category-route');
const enrollmentRoutes = require('./routes/enrollment-route');
const userRoutes = require('./routes/user-route');
const instructorRoutes = require('./routes/instructor-route');

// ===== UTILISATION DES ROUTES =====
app.use('/api/auth', authRoutes); // ex: /api/auth/login, /api/auth/google
app.use('/api/courses', courseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/instructors', instructorRoutes);

// ===== SWAGGER DOCS =====
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ===== ROUTE D'ACCUEIL =====
app.get('/', (req, res) => {
  res.send('Welcome to WebAcademy API');
});

// ===== MIDDLEWARE GLOBAL D’ERREUR =====
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    details: err.details || null,
  });
});

// ===== CONNEXION À MONGODB + LANCEMENT DU SERVEUR =====
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });

module.exports = app;
