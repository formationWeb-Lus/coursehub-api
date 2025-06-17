const bcrypt = require('bcryptjs');

const passwordEnClair = 'jlsa1993';
const hashDansMongo = '$2b$10$Mw9L1opxfj.C64Bfa5AxteMpRRYUWxos82PfR6rK8OcGmQYc9VZV2';

bcrypt.compare(passwordEnClair, hashDansMongo).then(result => {
  console.log(result ? '✅ Mot de passe valide' : '❌ Mot de passe invalide');
});
