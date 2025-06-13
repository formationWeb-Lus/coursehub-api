const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Routes d'auth classique
app.use('/api/auth', authRoutes);

// ✅ Connexion à MongoDB
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

// ✅ Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ✅ Routes principales
app.use('/api/users', require('./routes/user-route'));
app.use('/api/courses', require('./routes/course-route'));
app.use('/api/categories', require('./routes/category-route'));
app.use('/api/instructors', require('./routes/instructor-route'));
app.use('/api/enrollments', require('./routes/enrollment-route'));

// ✅ Accueil
app.get('/', (req, res) => {
  res.send('Welcome to WebAcademy API');
});
// Middleware global pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error(err); // Pour debug en dev
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || null;
  res.status(status).json({ message, details });
});


module.exports = app;
