const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
require('dotenv').config();

// Middleware globaux (doivent être déclarés avant les routes)
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/course-route');
const categoryRoutes = require('./routes/category-route');
const enrollmentRoutes = require('./routes/enrollment-route');
const userRoutes = require('./routes/user-route');
const instructorRoutes = require('./routes/instructor-route');

app.use('/api/auth', authRoutes);               // /login, /register
app.use('/api/course', courseRoute);
app.use('/api/category', categoryRoute);
app.use('/api/enrollment', enrollmentRoute);
app.use('/api/user', userRoute);
app.use('/api/instructor', instructorRoute);

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Accueil
app.get('/', (req, res) => {
  res.send('Welcome to WebAcademy API');
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    details: err.details || null,
  });
});

// Connexion à MongoDB
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
