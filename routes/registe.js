router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Vérifie que l’utilisateur a bien rempli tous les champs
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, mot de passe et nom sont requis' });
    }

    // Vérifie si l’email existe déjà en base de données
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email déjà utilisé' });
    }

    // Hash du mot de passe (sécurisé)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création du nouvel utilisateur
    const user = new User({
      email,
      password: hashedPassword,
      name,
      role: 'student' // valeur par défaut
    });

    // Sauvegarde en base de données
    await user.save();

    // Répond que l’inscription a réussi
    res.status(201).json({ message: 'Inscription réussie' });
  } catch (err) {
    next(err);
  }
});
