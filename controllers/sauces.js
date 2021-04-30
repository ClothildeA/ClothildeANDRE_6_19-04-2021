const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id; // suppression de l'id envoyé par le frontend
    const sauce = new Sauce({ // nouvelle instance du model Sauce en passant l'objet JS contenant toutes les informations requises du corps de requête analysé
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistée !'})) // Created
        .catch(error => res.status(400).json({ error })); // Bad request
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'})) //OK
      .catch(error => res.status(400).json({ error })); // Bad request
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'})) //OK
            .catch(error => res.status(400).json({ error })); // Bad request
        });
      })
      .catch(error => res.status(500).json({ error })); // Internal server error: Le serveur a rencontré une situation qu'il ne sait pas traiter.
  };
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce)) //OK
      .catch(error => res.status(404).json({ error })); // Not found
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces)) //OK
    .catch(error => res.status(400).json({ error })); // Bad Request
};