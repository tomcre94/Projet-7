const Book = require('../models/bookModel');
const fs = require('fs');
const path = require('path');

//Create
  //create and save new book 
  exports.createBook = async(req, res) => {
    try {
        delete req.body._id;
        let bookObject;
        try {
            bookObject = JSON.parse(req.body.book);
        } catch (error) {
            return res.status(400).json({ message: 'La structure JSON est invalide.' });
        }
        
        const book = new Book({
            ...bookObject,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename.replace(/\.jpeg|\.jpg|\.png/g, "_")}thumbnail.webp`
        });
        
        await book.save();
        res.status(201).json({ message: 'Livre enregistré !'})
    } catch(error) {
        res.status(500).json({ message: 'Une erreur est survenue lors de la création du livre.' });
    }
  };
  

  //Create rating
  exports.createRatingBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
          return res.status(404).json({ message: 'Livre introuvable' });
        }
    
        const isAlreadyRated = book.ratings.find(rating => rating.userId === req.auth.userId);
        if (!isAlreadyRated) {
            book.ratings.push({
                userId: req.auth.userId,
                grade: req.body.rating
            });

            let newRating = 0;
            book.ratings.forEach(rating => {
                newRating = newRating + rating.grade;
            });
            book.averageRating = book.ratings.length > 0 ? newRating / book.ratings.length : 0;
       
            await book.save();
            res.status(201).json(book);
        } else {
            return res.status(409).json({ message: 'Le livre a déjà été noté par cet utilisateur' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Une erreur est survenue lors de la création de la note pour le livre.' });
    }
  };

//Read
  //find a book
  exports.getOneBook = async(req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id });
        if (!book) {
            return res.status(404).json({ message: 'Livre introuvable' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Une erreur est survenue lors de la récupération du livre.' });
    }
};

  // find all books
  exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des livres.' });
    }
};
  //best rating
  exports.bestRating = async(_req, res) => {
    try {
        const books = await Book.find({}).sort({ averageRating: 'desc' }).limit(3);
        if (books.length === 0) {
            return res.status(404).json({ message: 'Aucun livre trouvé avec des notes.' });
        }
        res.json(books);
    } catch(error) {
        console.error(error.message);
        res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des meilleurs livres.' });
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
            return res.status(400).json({ error: "Format de requête invalide" });
        }
        if (req.file) {
            imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename.replace(/\.(jpeg|jpg|png)/g, "_")}thumbnail.webp`;
            bookInfo.imageUrl = imageUrl;
        }
        if (imageUrl && foundBook.imageUrl) {
          fs.unlink(path.join(__dirname, '..', foundBook.imageUrl), (err) => {
              if (err) {
                  console.error("Erreur lors de la suppression de l'ancienne image :", err);
              } else {
                  console.log("Ancienne image supprimée avec succès :", foundBook.imageUrl);
              }
          });
      }
        const foundBook = await Book.findOne({ _id: req.params.id, userId: req.auth.userId });
        if (!foundBook) {
            return res.status(403).json({ message: "unauthorized request" });
        }
        await Book.updateOne({ _id: req.params.id }, bookInfo);
        if (imageUrl && foundBook.imageUrl) {
            deleteImgFile(foundBook.imageUrl);
        }

        res.status(200).json({ message: "Livre modifié !" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la mise à jour du livre" });
    }
};
  
//Delete
  //delete a book
  exports.deleteOneBook = async (req, res) => {
    try {
      const book = await Book.findOne({ _id: req.params.id });
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
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
        } catch (error) {
          res.status(500).json({ error });
        }
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  };
  