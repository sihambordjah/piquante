const multer = require("multer");
//pour difinir la nature et le format d'un fichier
// On crée un dictionnaire des types MIME pour définire le format des images
// Donc la creation d'un objet pour ajouter une extention en fonction du type mime du ficher
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/gif": "gif",
};
//la destination du fichier(repertoire) et générer un nom
// de fichier unique

const storage = multer.diskStorage({
  //destination du stockage du fichier
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    //supprimmer les espaces dans le nom du fichier
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    //callback(null, name + "_" + Date.now() + "." + extension);
    //recréer le nom de fichier
    callback(null, `${name}_${Date.now()}.${extension}`);
  },
});
console.log("--->storage = ", storage);
// On export le module, on lui passe l'objet storage, la méthode single pour dire que c'est un fichier unique et on précise que c'est une image
module.exports = multer({ storage }).single("image");
