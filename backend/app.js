const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const app = express();
require('dotenv').config();
const path = require('path');

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MDP_BDD}@cluster0.py3bqzo.mongodb.net/`
  )
  .then(() => {
    console.log('Connexion à MongoDB réussie !');
  })
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB :', err);
    process.exit(1); // Arrête l'application en cas d'échec de connexion
  });

// Middleware Helmet pour sécuriser l'application
app.use(helmet());

// Middleware cors pour gérer les requêtes Cross-Origin
app.use(cors());

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
