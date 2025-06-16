const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const authRoutes = require('./routes/auth');        // contient login + register idéalement
require('dotenv').config();
const courseRoutes = require('./routes/course-route'); // chemin correct
app.use('/api/courses', courseRoutes);
const categoryRoutes = require('./routes/category-route');
const enrollmentRoutes = require('./routes/enrollment-route');
const userRoutes = require('./routes/user-route');
const instructorRoutes = require('./routes/instructor-route');

// Utilisation des routes
app.use('/api/categories', categoryRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/instructors', instructorRoutes);

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);   // ici authRoutes doit contenir les routes /login et /register

app.use('/api/users', require('./routes/user-route'));
// autres routes...
app.use('/api/enrollments', require('./routes/enrollment-route'));

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Accueil
app.get('/', (req, res) => {
  res.send('Welcome to WebAcademy API');
});

// Middleware global d’erreur
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    details: err.details || null,
  });
});

// Connexion à MongoDB puis démarrage serveur
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
