const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/bookModel');
const app = express();
const bookRoutes = require('./routes/book');

app.use('/api/book', bookRoutes);

mongoose.connect('mongodb+srv://jimbob:<PASSWORD>@cluster0-pme76.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

module.exports = app;
