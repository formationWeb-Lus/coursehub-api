const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const authRoutes = require('./routes/auth');


require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    // Démarre le serveur uniquement si le fichier est exécuté directement
    if (require.main === module) {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });
app.use('/api/auth', authRoutes);
// Middleware
app.use('/api/auth', authRoutes);
app.use(cors());
app.use(express.json());

// Session & Passport (GitHub Auth)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use('/instructors', require('./routes/instructor-route'));
app.use('/categories', require('./routes/category-route'));
app.use('/api/users', require('./routes/user-route'));
app.use('/api/courses', require('./routes/course-route'));
app.use('/api/enrollments', require('./routes/enrollment-route'));

// ✅ GitHub OAuth Route
const { router: oauthRouter } = require('./auth/oauth');
app.use('/api/auth', oauthRouter);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to WebAcademy API');
});

module.exports = app;
