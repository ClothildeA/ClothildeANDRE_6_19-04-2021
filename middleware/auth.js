const jwt = require('jsonwebtoken');
//ce middleware protège les routes sélectionnées et vérifie que l'utilisateur soit authentifé avant d'autoriser l'envoi de ses requêtes
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // récupération du token (sans 'bearer') dans Authorization de Headers
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // décodage du token grâce au package jwt
    const userId = decodedToken.userId; // une fois qu le token est décodé, on récupère le userId qui se trouve dans le token
    if (req.body.userId && req.body.userId !== userId) { // si il y a un userId dans le corps de la requête et que celui-ci est différent du userId
      throw 'User ID non valable'; // on ne veut pas authentifier la requête
    } else { // si il n'y a pas d'erreur
      next(); // on passe la requête au prochain middleware (dans ce cas: multer)
    }
  } catch {
    res.status(401).json({
      error: new Error('Requête non authentifiée !') // Unauthorized
    });
  }
};