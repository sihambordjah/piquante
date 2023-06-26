//importer le backage pour utiliser les variables d'environnement
const dotenv = require("dotenv");
const resultat = dotenv.config();

//Cet avertissement a été introduit pour informer
// les utilisateurs du changement qui sera introduit dans Mongoose 7 à la valeur par défaut de strictQuery
//supprimmer le message d'avertissement

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
//

module.exports = mongoose;
