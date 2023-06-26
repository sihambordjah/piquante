//importer express
const express = require("express");

//importer le controllers/user.js
const userController = require("../controllers/user");
console.log("-->contenu: user", userController);

//la fonction Router() pour créer un nouvel objet routeur.
const router = express.Router();

//la route (endpoint) signup
router.post("/signup", userController.signup);
//la route (endpoint) login
router.post("/login", userController.login);

//exporter le module
module.exports = router;
