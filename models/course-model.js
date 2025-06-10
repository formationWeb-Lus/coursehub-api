const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },                        // 1 - Titre du cours
  description: { type: String, required: true },                  // 2 - Description du cours
  price: { type: Number, required: true },                        // 3 - Prix du cours
  duration: { type: String, required: true },                     // 4 - Durée (ex: "4 semaines", "10 heures")
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' }, // 5 - Niveau
  category: { type: String },                                     // 6 - Catégorie (ex: développement, marketing...)
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 7 - Référence vers l'enseignant
  createdAt: { type: Date, default: Date.now }                    // 8 - Date de création
});

module.exports = mongoose.model('Course', courseSchema);
