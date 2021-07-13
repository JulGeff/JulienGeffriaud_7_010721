const bcrypt = require('bcrypt');        // importation du package de cryptage de mdp bcrypt
const models = require('../models');        // importation des modèles sequelize
const User = models.user,
const Post = models.post
const jwt = require('jsonwebtoken');     // importation package pour création et vérification des tokens
require('dotenv').config()               // importation dotenv pour sécuriser passwords
const TokenKey = process.env.TOKENKEY;   // Récupération de la clé de cryptage des tokens via dotenv


//CREATION D'UN COMPTE UTILISATEUR
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)    // On crypte le mot de passe (algorithme exécuté 10 fois) / asynchrone

        .then(hash => {   
            const newUser = User.create({           // modèle sequelize
              name : req.body.name,
              firstName : req.body.firstName,
              email: req.body.email,
              password: hash                  // On enregistre le mdp crypté plutôt que le mdp simple
              })

        .then(newUser => res.status(201).json({ message: 'Utilisateur créé !' })) // Requête traitée avec succès et création d’un document
        .catch(error => res.status(400).json({ error })); // Bad Request
      })
    .catch(error => res.status(500).json({ error })); // Erreur interne du serveur
  };


//CONNEXION AU COMPTE UTILISATEUR
exports.login = (req, res, next) => {
    User.findOne ({ 
      where: {  email: req.body.email } })   // On utilise le modèle sequelize User pour vérifier que l'email rentré correspond à un email de la bas de données
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' }); // Unauthorized	
        }
        bcrypt.compare(req.body.password, user.password)  // On tuilise la fonction compare de bcrypt pour comparer les passwords
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' }); // Unauthorized
            }
            res.status(200).json({ // Requête traitée avec succès / Renvoie le token au frontend
              userId: user._id,     // On renvoie l'id
              token: jwt.sign(      // On utilise la fonction sign de jsonwebtoken pour encoder un nouveau token
                { userId: user._id },
                TokenKey,            // récupère la chaîne secrète d'encodage de notre token via dotenv
                { expiresIn: '24h' }    // A MODIFIER EXPIRATION QUAND LOGOUT
              )
            });
          })
          .catch(error => res.status(500).json({ error })); 	// Erreur interne du serveur
      })
      .catch(error => res.status(500).json({ error })); // Erreur interne du serveur
  };


  // AJOUT MODIF URTILISATEUR ? IMAGE ?

  // RECUPERATION DU PROFIL D'UN UTILISATEUR

exports.getOneUser = (req, res, next) => {
 
  User.findOne ({ 
      where: {  email: req.body.email }   
  })
      .then(user => res.status(200).json(user))
      .catch(error => res.status(500).json(error))
};


  // RECUPERATION DE TOUS LES PROFILS UTILSATEURS

exports.getAllUsers = (req, res, next) => {
  User.findAll()
  .then(users => {
      console.log(users);
      res.status(200).json({data: users});
  })
  .catch(error => res.status(400).json({ error }));
};

// MODIFICATION DU PROFIL UTILISATEUR
exports.modifyUser = (req, res, next) => {

  const firstName = req.body.firstName;
  const name =  req.body.name;

  // vérification que tous les champs sont remplis
  if(firstName === null || firstName === '' || name === null ||name === '') {
      return res.status(400).json({'error': "Les champs 'nom' et 'prénom' doivent être remplis "});
  } else {

User.update({ ...userObject, id:  req.params.id}, { where: {id: req.params.id} })
.then(() => res.status(200).json({ message: 'Utilisateur modifié !'}))
.catch(error => res.status(400).json({ error }));
}}

// SUPPRESSION D'UN PROFIL UTILSATEUR
exports.deleteUser = (req, res, next) => {
  Post.destroy({                                      // Suppression de tous les posts liés au compte utilisateur
    where: { email: req.body.email }})
        
        .then(() =>
        User.findOne({ 
          where: {  email: req.body.email }  })
          .then(user => {
            const filename = user.imageUrl;
            fs.unlink(`images/${filename}`, () => {   //Suppression de l'image liée au profil
              User.destroy({     
                where: {  email: req.body.email }  }) }) // Suppression du user dans la base de données
              .then(() => res.status(200).json({ message: 'Utilisateur supprimé !'}))
            })
        )
          
  .catch(error => res.status(400).json({ error }));
};