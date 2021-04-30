const express = require('express');
const bodyParser = require('body-parser'); // Rends le corps de la requête plus facilement exploitable
const mongoose = require('mongoose');
const path = require('path');

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://clothilde:motdepasse@cluster0.ooshs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express(); // permet la création de l'application express

app.use((req, res, next) => { // Ajout de ce middleware pour résoudre le problème de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json()); // Utilisation de la méthode body-parser pour transformer le corps de la requête en objet JS utilisable (JSON)

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app; //exportation pour permettre l'utilisation de la constante/application depuis les autres fichiers
