const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },                   // 1 - nom complet
  email: { type: String, required: true, unique: true },    // 2 - email unique
  password: { type: String, required: true },                // 3 - mot de passe
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' }, // 4 - rôle utilisateur
  firstName: { type: String },                                // 5 - prénom
  lastName: { type: String },                                 // 6 - nom de famille
  age: { type: Number, min: 0 },                             // 7 - âge (optionnel)
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]  // 8 - cours inscrits (références)
});

module.exports = mongoose.model('User', userSchema);
