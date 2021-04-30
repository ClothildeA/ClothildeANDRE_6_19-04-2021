const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'})) // Created
                .catch(error => res.status(400).json({ error })); // Bad request
        })
        .catch(error => res.status(500).json({ error })); // Internal server error
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) { // si l'utilisateur n'est pas trouvé
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password) // si l'utilisateur est trouvé, on compare le mot de passe rentré par l'utilisateur avec le hash enregistré avec l'user lors de la création du compte
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' }); // Unauthorized
            }
            res.status(200).json({ //OK
              userId: user._id,
              token: jwt.sign(
                { userId: user._id }, // encodage du userId afin de ne pas pouvoir modifier les objets créés par les autres utilisateurs
                'RANDOM_TOKEN_SECRET', // à modifier avec une chaine de caractères plus complexe pour la production
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error })); 
      })
      .catch(error => res.status(500).json({ error }));
  };