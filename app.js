//importer express
const express = require("express");
//importer body-parser
const bodyParser = require("body-parser");
const cors = require("cors");
//importation node.js utilitaire pour travailler avec les chemins de fichiers de répertoires
const path = require("path"); // Plugin qui sert dans l'upload des images et permet de travailler avec les répertoires et chemin de fichier

//importer connextion base de donnée mongodb
const mongoose = require("./db/db");
//importer les routes
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

//creer une application express on  appellons  la méthode express (L'application utilise le framework express)
const app = express();
//app.use (méthode express) route générale et la fonction (middleware)

//gérer les problemes de CORS( Cross Origin Resource Sharing)
app.use((req, res, next) => {
  // res.header(
  //   "Access-Control-Allow-Headers, *, Access-Control-Allow-Origin",
  //   "Origin, X-Requested-with, Content_Type,Accept,Authorization",
  //   "http://localhost:4200"
  // );
  // res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
  //permettre a l'application d'accéder a l'API sans probleme
  //En-têtes (headers) de réponse
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

// Transforme les données arrivant de la requête POST en un objet JSON facilement exploitable
app.use(express.json());

app.use(cors());

//transformer le body en JSON objet javascript utilisable
app.use(bodyParser.json());

//la route d'authentification
app.use("/api/auth", userRoutes);
//la route de la sauce
app.use("/api/sauces", sauceRoutes);
//la route pour accéder aux images (gestion des images de manière statiques)
app.use("/images", express.static(path.join(__dirname, "images")));

//exporter app.js pour pouvoir y accéder depuis un autre fichier
module.exports = app;
