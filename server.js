//importer le le package HTTP de Node.js pour avoir les outils pour creé le server
const http = require("http");

//importer l'application
const app = require("./app");

//importer les packages pour utiliser les variable d'envirennement
const dotenv = require("dotenv");
const resultat = dotenv.config();

//fonction qui  renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
//le serveur soit il écoute la varibale d'envirenement du port grace a 'process.env.PORT'
//soit le port 3000
const port = normalizePort(process.env.PORT || "3000");
//paramétrage du port avec la méthode set de express
app.set("port", port);

//fonction qui recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};
//la méthode createServer() prend en argument la fonction qui sera appelé
//a chaque requete recu par le serveur
//ici les fonctions seront dans app.js
const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});
//le serveur écoute les requetes sur le port
server.listen(port);
