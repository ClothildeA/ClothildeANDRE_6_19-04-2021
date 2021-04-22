const User = require('../models/User');
const Sauce = require('../models/Sauce');

exports.likeManagement (req, res, next) => {
    User.findOne({_id: req.body.userId})
    .then(user => {
        Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            
        })
    })
    .catch(error => res.status(404).json({ error }));
}