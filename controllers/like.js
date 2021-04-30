const User = require('../models/User');
const Sauce = require('../models/Sauce');

exports.likeManagement = (req, res, next) => {
    //Recherche de l'utilisateur dans la base de données
    User.findOne({_id: req.body.userId})

    //Recherche de la sauce dans la basse de données
    .then(user => {
        Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            switch (req.body.like) //Evalue l'expression (req.body.like)
			{
				case -1: // Exécute cette instruction lorsque le résultat de l'expression correspond à case -1 : Dislike
				console.log(req.body.like);
					if(sauce.usersDisliked.indexOf(user.id) == -1) //si le userId n'est pas dans la tableau de dislike 
					{
						sauce.usersDisliked.push(user.id) // On ajoute l'userId au tableau
						const isPresent = sauce.usersLiked.indexOf(user.id);
						if(isPresent > -1) // Si l'userId est trouvé dans le tableau des likes on le supprime
						{
							sauce.usersLiked.splice(isPresent, 1)
						}
					}
				    break;

                case 0:  // Exécute cette instruction lorsque le résultat de l'expression correspond à case 0: suppression du like ou dislike
				console.log(req.body.like);
					const inLike = sauce.usersLiked.indexOf(user.id);
					const inDislike = sauce.usersDisliked.indexOf(user.id);
					if(inLike > -1)// Si l'userId est trouvé dans le tableau des like on le supprime
					{
						sauce.usersLiked.splice(inLike, 1);
					}

					if(inDislike > -1)// Si l'userId est trouvé dans le tableau de dislke on le supprime
					{
						sauce.usersDisliked.splice(inDislike, 1);
					}
					break;

				case 1:  // Exécute cette instruction lorsque le résultat de l'expression correspond à case 1: like
				console.log(req.body.like);
					if(sauce.usersLiked.indexOf(user.id) == -1)// Si l'userId n'est pas trouvé dans le tableau des likes
					{
						sauce.usersLiked.push(user.id) // on ajoute l'userId au tableau des likes
						const isPresent = sauce.usersDisliked.indexOf(user.id);
						if(isPresent > -1)// Si l'userId est trouvé dans le tableau des dislikes on le supprime
						{
							sauce.usersDisliked.splice(isPresent, 1)
						}
					}
					break;

				default: // Si body.like n'a auccune de ces trois valeurs: null est renvoyer a l'utilisateur
					res.status(200).json({message: null});
					break;
                }

				// Mise à jour des quantités de like/dislike
                sauce.likes = sauce.usersLiked.length;
			    sauce.dislikes = sauce.usersDisliked.length;
			    sauce.save(sauce)
			    .then((sauce) => {
				    res.status(200).json({message: "Done !"}) // OK: La requête a réussi. Post: La ressource décrivant le résultat de l'action est transmise dans le corps du message.
			    })
			    .catch(error => {res.status(403).json({ error })}); //Forbidden: Le client n'a pas les droits d'accès au contenu, donc le serveur refuse de donner la véritable réponse.
        })
    	.catch(error => {res.status(404).json({ error })}); // Not found: Le serveur n'a pas trouvé la ressource demandée
    })
    .catch(error => res.status(404).json({ error }));
}