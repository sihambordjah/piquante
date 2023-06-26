//importer express
const express = require("express");
//importer le controllers/user.js
const sauceController = require("../controllers/sauce");
//importer du middleware d'authentification.js
const authentification = require("../middleware/authentification");
//importer le multer-config.js pour la gestion des fichiers images
const multer = require("../middleware/multer-config");
//la fonction router pour créer un nouvel objet routeur.
const router = express.Router();

//les routes
router.post("/", authentification, multer, sauceController.createSauce);

router.get("/", authentification, sauceController.getAllSauce);

router.get("/:id", authentification, sauceController.getOneSauce);

router.put("/:id", authentification, multer, sauceController.updateOneSauce);

router.delete("/:id", authentification, sauceController.deleteOneSauce);

router.post("/:id/like", authentification, sauceController.likeDislikeSauce);

//exporter le module
module.exports = router;
