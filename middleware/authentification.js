require("dotenv").config();

//importer jsonwebtoken
const jwt = require("jsonwebtoken");
//exportation de la fonction du middeleware
module.exports = (req, res, next) => {
  try {
    //se fera en 3 etape
    //1- Récupérer le token
    // console.log("authentification", req.headers.authorization);
    const token = req.headers.authorization.split(" ")[1]; //copy le token a partir de l'espace et en prend index 1 du tableau
    // console.log("token = ", token);
    //2- Décoder le token qu'il y a dans la REQUEST envoyé par le FRONT
    const decodedToken = jwt.verify(
      token,
      `${process.env.ACCESS_TOKEN_SECRET}`
    );

    console.log("-->decodedtoken:", decodedToken);
    //3- Récuperer userId qu'il y a a l'interieur du token déchiffré et le comparer avec userId en claire
    const userIdDecodedToken = decodedToken.userId; //user id de token decoder
    // console.log("--> userIdDT = ", userIdDecodedToken);
    // console.log("--> userIdRequest = ", req.body.userId);

    //comparaison du userId qu'il y a en clair dans la req qui vien de front avec le userId qu'il ya dans le token.
    if (req.body.userId && req.body.userId !== userIdDecodedToken) {
      throw "UserId non valide";
      console.log("contenu req depuis le else", req);
    } else {
      next();
    }
    //si y a des erreurs dans le try on les récupéres ici
  } catch (error) {
    res.status(401).json({
      message: "Echec d'authentification",
      error: error,
    });
  }
};
