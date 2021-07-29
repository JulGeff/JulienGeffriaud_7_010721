'use strict'

const User = require('../models/user');     // importation des modèles sequelize
const Publication = require('../models/publication');

const Comment = require('../models/comment');
const fs = require('fs'); // importation du package file system de node, qui donne notamment accès aux fonctions permettant de supprimer les fichiers.
const jwt = require('jsonwebtoken');  // importation package pour création et vérification des tokens
require('dotenv').config()            // importation dotenv pour sécuriser passwords
const TokenKey = process.env.TOKENKEY;// Récupération de la clé de cryptage des tokens via dotenv

//CREATION D'UN COMMENTAIRE
exports.createComment = (req, res, next) => { 

    const newComment = 
        Comment.create({
            userId : req.body.id,
            publicationId : req.body.publicationId,
            comment : req.body.comment
                
    })
        .then((newComment) => res.status(201).json({
            message: 'Commentaire enregistré !' // Requête traitée avec succès et création d’un document.

        }))
        .catch(error => res.status(400).json({  //Bad Request
            error
        }));
}


// RECUPERATION DE TOUS LES COMMENTAIRES LIES A UNE PUBLICATION
exports.getAllComments = (req, res, next) => {
    const publicationId = req.query.publicationId
    Comment.findAll({
        attributes: ['comment', 'updatedAt','userId','id'],
        where: {
            publicationId: publicationId
          },
        include: {
            model: User,
            attributes:['firstName', 'lastName']
        },
        order: [['updatedAt', 'DESC']]
    })

    .then(        // renvoie un tableau contenant toutes les publications dans notre base de données
        (comments) => {        
            res.status(200).json(comments); // publications retournées dans une promise et envoyée au frontend
        }
    ).catch(
        (error) => {
            res.status(400).json({      // Bad request
                error: error
            });
        }
    );
};

//SUPPRESSION D'UN COMMENTAIRE
  exports.deleteComment = (req, res, next) => { 
     console.log(req.query,req.params)
    Comment.destroy ({ where: { id: req.query.commentId }}) // callback : Suppression de la publication avec l'id correspondant
        
        .then(() => res.status(200).json({ message: 'Publication supprimée !'})) // Requête traitée avec succès
        .catch(error => res.status(500).json({ error })); // Internal Server Error	
  };


/*
// MODIFICATION D'UN COMMENTAIRE
exports.modifyPublication = (req, res, next) => {
    // éléments de la requète
    const title = req.body.title;
    const content =  req.body.content;
  
    // vérification que tous les champs sont remplis
    if(title === null || title === '' || content === null || content === '') {
        return res.status(400).json({'error': "Les champs 'Titre' et 'texte' sont obligatoires"});
    }
    
  const publicationObject = req.body;
    
  Publication.update({ ...publicationObject, id:  req.params.id}, { where: {id: req.params.id} })
  .then(() => res.status(200).json({ message: 'Publication modifiée !'}))
  .catch(error => res.status(400).json({ error }));
};


*/