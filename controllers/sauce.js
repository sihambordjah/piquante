// Récupération du modèle créé grâce à la fonction schéma de mongoose

// Récupération du modèle 'sauce'

//importer le models de la base de donnée sauce.js
const Sauce = require("../models/Sauce");

// Récupération du module 'file system' de Node permettant de gérer ici les téléchargements et modifications d'images
const fs = require("fs");

// Permet de créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
  // console.log("contenue: req.body", req.body);
  // console.log("---'contenu POT req.file'---- ", req.file);
  // console.log("-----'contenue: req.body.sauce'------", req.body.sauce);
  const sauceObject = JSON.parse(req.body.sauce);
  // On supprime l'id généré automatiquement et envoyé par le front-end.
  // L'id de la sauce est créé par la base MongoDB lors de création dans DB
  delete sauceObject._id;

  // Création d'une instance du modèle Sauce
  const sauce = new Sauce({
    ...sauceObject,
    //   // On modifie l'URL de l'image, on veut l'URL complète, quelque chose dynamique avec les segments de l'URL
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  console.log("Contenue sauce de new sauce", sauce);
  //envoyer l'objet sauce dans la base de donnée MongoDB
  sauce
    .save()
    // On envoi une réponse au frontend avec un statut 201 sinon on a une expiration de la requête
    .then(() => {
      res.status(201).json({
        message: "Objet sauvegarder dans la DB",
        contenu: req.body,
      });
    })
    // On ajoute un code erreur en cas de problème
    .catch((error) => res.status(400).json({ error }));
};

// Permet de récuperer toutes les sauces de la base MongoDB
exports.getAllSauce = (req, res, next) => {
  // On utilise la méthode find pour obtenir la liste complète
  // des sauces trouvées dans la DB, l'array de toutes les sauces de la DB
  Sauce.find()
    // Si OK on retourne un tableau de toutes les données
    .then((tousLesSauce) => res.status(200).json(tousLesSauce))
    .catch((error) => res.status(400).json({ error }));
};

//Permet de récuperer uniquement une sauce grace a son id de la DB
exports.getOneSauce = (req, res, next) => {
  console.log("---'getOneSauce'---- ", req.params.id);
  console.log({ _id: req.params.id });

  // On utilise la méthode findOne et on lui passe l'objet de comparaison,
  //on veut que l'id de la sauce soit le même que le paramètre de la requête
  Sauce.findOne({ _id: req.params.id })
    // Si ok on retourne une réponse et l'objet
    .then((uneSauce) => res.status(200).json(uneSauce))
    // Sinon on génère une erreur 404 pour dire qu'on ne trouve pas l'objet
    .catch((error) => res.status(400).json({ error }));
};

//Permet de modifier une sauce sélectionné par son _id de la DB
exports.updateOneSauce = (req, res, next) => {
  console.log(req.params.id);
  console.log({ _id: req.params.id });
  console.log("---'contenu req.body'---- ", req.body);
  console.log("---'contenu PUT req.file'---- ", req.file);

  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
      .then((objetsauce) => {
        //Récuperer le nom de l'image a supprimer dans la DB
        const filename = objetsauce.imageUrl.split("/images")[1];
        console.log("filename", filename);

        //Supression de l'image dans le dossier images du serveur on utilise la fonction unlik
        fs.unlink(`images/${filename}`, (error) => {
          if (error) throw error;
        });
      })
      .catch((error) => res.status(404).json({ error }));
  } else {
    console.log("false");
  }

  //l'objet qui va etre mise a jour dans la DB¸
  console.log("voila (req.body.sauce)", req.body.sauce);
  //deux cas possible
  //Si il y a un fichier :
  const sauceObject = req.file
    ? // Opérateur ternaire équivalent à if() {} else {} => condition '?' Instruction si vrai ':' Instruction si faux
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : //Si la modification ne contient pas de fichier (pas de nouvelle image)
      { ...req.body };
  // //Mise à jour de l'objet :

  //modification qui seront envoyé dans la DB
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then((updateOneSauce) =>
      res.status(200).json({
        message: "l'objet a été modifier",
        contenu: req.body,
      })
    )
    // Sinon on génère une erreur 404 pour dire qu'on ne trouve pas l'objet
    .catch((error) => res.status(400).json({ error }));
};

//Permet de supprimer une sauce sélectionné par son id
exports.deleteOneSauce = (req, res, next) => {
  /*modification qui seront envoyé dans la DB pour pouvoir récupérer
   l'url de l'image de l'objet a supprimer pour pouvoir l'effacer du serveur*/

  Sauce.findOne({ _id: req.params.id })
    .then((objetsauce) => {
      const filename = objetsauce.imageUrl.split("/images")[1];

      // Avec ce nom de fichier, on appelle unlink pour suppr le fichier
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })

          .then(res.status(200).json({ message: "objet effacé de la DB" }))
          .catch((error) => res.status(404).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));

  // Sauce.deleteOne({ _id: req.params.id })
  //   .then((deleteOneSauce) =>
  //     res.status(200).json({ message: "l'objet a été supprimé" })
  //   )
  //   // Sinon on génère une erreur 404 pour dire qu'on ne trouve pas l'objet
  //   .catch((error) => res.status(400).json({ error }));
};

//gestion des likes  et des deslikes
exports.likeDislikeSauce = (req, res, next) => {
  //mise au format de l'id pour pouvoir aller chercher l'objet correspondant
  console.log({ _id: req.params.id });

  // Like présent dans le body
  let like = req.body.like;
  // On prend le userID
  let userId = req.body.userId;
  // On prend l'id de la sauce
  let sauceId = req.params.id;

  //aller chercher l'objet dans la DB
  Sauce.findOne({ _id: req.params.id })
    .then((objetsauce) => {
      console.log("resultat promise: ", objetsauce);
      if (!objetsauce.usersLiked.includes(userId) && like === 1) {
        //userId n'est pas dans usersLiked DB et requette front like a 1
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: +1 },
            $push: { usersLiked: userId },
          }
        )
          .then(() => res.status(201).json({ message: "like ajouté" }))
          .catch((error) => res.status(400).json({ error }));
      }

      //Enlever le like pour la sauce: " like = 0 (likes= 0, pas vote ) "
      if (objetsauce.usersLiked.includes(userId) && like === 0) {
        //userId est dans usersLiked DB et requette front like = 0
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: -1 },
            $pull: { usersLiked: userId },
          }
        )
          .then(() => res.status(201).json({ message: " Like retiré !" }))
          .catch((error) => res.status(400).json({ error }));
      }

      //Ajouter le dislike pour la sauce: " like = -1 (dislikes = +1) "
      if (!objetsauce.usersDisliked.includes(userId) && like === -1) {
        //userId n'est pas dans usersDisliked DB et requette front like = -1
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: +1 },
            $push: { usersDisliked: userId },
          }
        )
          .then(() => res.status(201).json({ message: "Dislike ajouté" }))
          .catch((error) => res.status(400).json({ error }));
      }

      //Enlever le dislike pour la sauce: " like = 0 (dislikes= 0, pas de vote ) "
      if (objetsauce.usersDisliked.includes(userId) && like === 0) {
        //userId est dans usersLiked DB et requette front like = 0
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: userId },
          }
        )
          .then(() => res.status(201).json({ message: " disLike retiré !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(404).json({ error }));
};
