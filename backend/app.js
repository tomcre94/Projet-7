const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
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
    process.exit(1);
  });

// Middleware cors pour gérer les requêtes Cross-Origin
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:4000',
      'http://localhost:3000/*',
    ],
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  })
);

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
