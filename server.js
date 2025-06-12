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

// Connect to MongoDB
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

// Middleware global (ordre important !)
app.use(cors());
app.use(express.json());  // <<< do this BEFORE your routes

// Session & Passport (GitHub Auth)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);  // after express.json()
app.use('/instructors', require('./routes/instructor-route'));
app.use('/categories', require('./routes/category-route'));
app.use('/api/users', require('./routes/user-route'));
app.use('/api/courses', require('./routes/course-route'));
app.use('/api/enrollments', require('./routes/enrollment-route'));

// GitHub OAuth Route
const { router: oauthRouter } = require('./auth/oauth');
app.use('/api/auth', oauthRouter);

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to WebAcademy API');
});

module.exports = app;
