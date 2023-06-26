//importer bcrypt pour hacher le password
const bcrypt = require("bcrypt");

//importer le jsonwebtoken
const jwt = require("jsonwebtoken");
// chargement du fichier d'env
require("dotenv").config();

//importer le models de la base de donnée User.js
const User = require("../models/User");
console.log("contenu: User", User);

//Dans le controllers/user.js
//signup pour enregistrer le nouvel utilisateur dans la BD
exports.signup = (req, res, next) => {
  // console.log("-----> contenue: req.body -", req.body.email);
  // console.log("Contenue: req.body - ", req.body.password);

  //haché le mot de passe avant de l'envoyer dans la base de donnée
  //salt = 10 combien de fois sera executer l'Algorith de hachage
  bcrypt
    .hash(req.body.password, 10)
    .then((hach) => {
      //ce qui va etre entregistrer dans MongoDB
      const user = new User({
        email: req.body.email,
        password: hach,
      });
      //envoyer le user dans la base de donnée MongoDB
      //la méthode save renvoi des promesses
      user
        .save()
        .then(() =>
          res.status(201).json({ message: "utilisateur créé et sauvegarder" })
        )
        .catch((error) => res.status(400).json({ error }).send());
    })
    .catch((error) => res.status(500).json({ error }).send(console.log(error)));
};

//login pour s'authentifier
exports.login = (req, res, next) => {
  //contenue de la requete
  // console.log("contenue login", req.body.email);
  // console.log("contenue login: req.body", req.body.password);

  //Recherche si l'utilisateur(si l'email existe) existe dans la ba¸BD MongoDB
  User.findOne({ email: req.body.email })
    //si l'email de l'user n'est pas présent, l'utilisateur n'existe pas
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur inexistant" });
      }
      //Si l'user existe compare mot de passe entré par le front et le hash de la base de données
      bcrypt
        .compare(req.body.password, user.password)
        .then((controlePassword) => {
          console.log("--->controlePassword", controlePassword);

          //si le password est incorrect
          if (!controlePassword) {
            res.status(401).json({ error: "le mot de passe est incorrect" });
          }

          //si le password est correct
          res.status(200).json({
            //encodage du userId pour la création de nouveau objet(objet "cad les objets créé dns la BD" et userId seront liés)
            userId: user._id,
            token: jwt.sign(
              //Pour créer le token on a besoin de 3 éléments
              { userId: user._id },
              `${process.env.ACCESS_TOKEN_SECRET}`,
              { expiresIn: "24h" }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })

    .catch((error) => res.status(500).json({ error }));
};
