//importer mongoose
const mongoose = require("mongoose");

// On rajoute ce validateur comme plugin
var uniqueValidator = require("mongoose-unique-validator");

// la valeur unique , avec l'élément mongoose-unique-validator passé comme plug-in,
// s'assurera que deux utilisateurs ne peuvent partager la même adresse e-mail.
// Utilisation d'une expression régulière pour valider le format d'email.
// Le mot de passe fera l'objet d'une validation particulière grâce au middleware verifPasword et au model password

//le modele de base de donnée pour signup (pour enregistrer un nouvel utilisateur) en utilise la fonction Schema de mongoose
const userSchema = mongoose.Schema({
  // L'email doit être unique
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Appliquez le plugin uniqueValidator à userSchema.pour ne pas enregistrer le meme adresse email dans la base de donnée
userSchema.plugin(uniqueValidator);

//importer le module
module.exports = mongoose.model("User", userSchema);
