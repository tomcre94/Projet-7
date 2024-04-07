const express = require('express');
const router = express.Router();

//create and save new book
router.post('/api/stuff', (req, res, next) => {
    delete req.body._id;
    const book = new Book({
      ...req.body
    });
    thing.save()
      .then(() => res.status(201).json({ message: 'Livre enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  });

  //find a book
  router.get('/:id', (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then(book => res.status(200).json(thing))
      .catch(error => res.status(404).json({ error }));
  });

  //update a book
  router.put('/:id', (req, res, next) => {
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Livre modifié !'}))
      .catch(error => res.status(400).json({ error }));
  });

  // find books
  router.use('/stuff', (req, res, next) => {
    Book.find()
      .then(things => res.status(200).json(things))
      .catch(error => res.status(400).json({ error }));
  });

  //delete a book
  router.delete('/:id', (req, res, next) => {
    Book.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Livre supprimé !'}))
      .catch(error => res.status(400).json({ error }));
  });

  module.exports = router;