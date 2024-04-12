const Book = require('../models/bookModel');
const fs = require('fs');
const path = require('path');

//Create
//create and save new book
exports.createBook = async (req, res) => {
  try {
    delete req.body._id;
    let bookObject;
    try {
      bookObject = JSON.parse(req.body.book);
    } catch (error) {
      return res.status(400).json({ error });
    }

    const book = new Book({
      ...bookObject,
      imageUrl: `${req.protocol}://${req.get(
        'host'
      )}/images/${req.file.filename.replace(
        /\.jpeg|\.jpg|\.png/g,
        '_'
      )}thumbnail.webp`,
    });

    await book.save();
    res.status(201).json({ message: 'Livre enregistré !' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

//Create rating
exports.createRatingBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error });
    }

    const isAlreadyRated = book.ratings.find(
      (rating) => rating.userId === req.auth.userId
    );
    if (!isAlreadyRated) {
      book.ratings.push({
        userId: req.auth.userId,
        grade: req.body.rating,
      });

      let newRating = 0;
      book.ratings.forEach((rating) => {
        newRating = newRating + rating.grade;
      });
      book.averageRating =
        book.ratings.length > 0 ? newRating / book.ratings.length : 0;

      await book.save();
      res.status(201).json(book);
    } else {
      return res.status(409).json({ error });
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

//Read
//find a book
exports.getOneBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ error });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// find all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

//best rating
exports.bestRating = async (_req, res) => {
  try {
    const books = await Book.find({}).sort({ averageRating: 'desc' }).limit(3);
    if (books.length === 0) {
      return res.status(404).json({ error });
    }
    res.json(books);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err });
  }
};

//Update
//update a book
exports.updateOneBook = async (req, res) => {
  try {
    let bookInfo;
    let imageUrl;

    if (req.body.book && typeof req.body.book === 'string') {
      bookInfo = JSON.parse(req.body.book);
    } else if (req.body.book && typeof req.body.book === 'object') {
      bookInfo = req.body.book;
    } else {
      return res.status(400).json({ error });
    }
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get(
        'host'
      )}/images/${req.file.filename.replace(
        /\.(jpeg|jpg|png)/g,
        '_'
      )}thumbnail.webp`;
      bookInfo.imageUrl = imageUrl;
    }
    if (imageUrl && foundBook.imageUrl) {
      fs.unlink(path.join(__dirname, '..', foundBook.imageUrl), (err) => {
        if (err) {
          console.error(
            "Erreur lors de la suppression de l'ancienne image :",
            err
          );
        } else {
          console.log(
            'Ancienne image supprimée avec succès :',
            foundBook.imageUrl
          );
        }
      });
    }
    const foundBook = await Book.findOne({
      _id: req.params.id,
      userId: req.auth.userId,
    });
    if (!foundBook) {
      return res.status(403).json({ error });
    }
    await Book.updateOne({ _id: req.params.id }, bookInfo);
    if (imageUrl && foundBook.imageUrl) {
      deleteImgFile(foundBook.imageUrl);
    }

    res.status(200).json({ message: 'Livre modifié !' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

//Delete
//delete a book
exports.deleteOneBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ error });
    }

    if (book.userId != req.auth.userId) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    const filename = book.imageURL.split('/images/')[1];
    fs.unlink(`images/${filename}`, async (err) => {
      if (err) {
        console.error(err.message);
      }

      try {
        await book.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Livre supprimé !' });
      } catch (err) {
        res.status(500).json({ error: err });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
