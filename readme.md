# Projet-6 : Construisez une API sécurisée pour une application d'avis gastronomiques

Une application dans laquelle les utilisateurs peuvent ajouter leurs sauces préférées et liker ou disliker les sauces proposées par les autres.

## Technologies utilisées:

JS, Node.js, MongoDB, Mongoose, Express

# Backend

- Mettre les variables d'envirennement (base de donnée MongoDB)
- Créer le dossier images ou on met tous les images du backend

- Pour lancer le serveur: `$ npm run server`

# Routes

## La route POST créer un compte

http://localhost:3000/api/auth/signup

## La route POST pour se login

http://localhost:3000/api/auth/login

## La route POST pour créer une sauce

http://localhost:3000//api/sauces/

## La route GET pour afficher tous les objets qu'il y a dans la sauce

http://localhost:3000//api/sauces/

## La route GET pour afficher un objet grace a son id

http://localhost:3000//api/sauces/:id

## La route PUT pour modifier un objet qui a été sélectionné par son \_id

http://localhost:3000//api/sauces/:id

## La route DELETE pour supprimé un objet qui a été sélectionné par son \_id

http://localhost:3000//api/sauces/:id

## La Route POST qui permet de gérer les likes des sauces

http://localhost:3000//api/sauces/:id/like
