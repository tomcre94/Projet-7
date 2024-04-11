const Book = require('../models/bookModel');
const fs = require('fs');

//Create
  //create and save new book 
  exports.createBook = async(req, res) => {
  try {
      delete req.body._id;
      const bookObject = JSON.parse(req.body.book);
      const book = new Book({
          ...bookObject,
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename.replace(/\.jpeg|\.jpg|\.png/g, "_")}thumbnail.webp`
      });
      await book.save();
      res.status(201).json({ message: 'Livre enregistré !'})
  } catch(error) {res.status(400).json({ error })};
  }

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
        res.json(book);
    } catch (error) {
        res.status(404).json({ error });
    }
};

  // find all books
  exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
  //best rating
  exports.bestRating = async(_req, res) => {
    try {
        const books = await Book.find({}).sort({ averageRating: 'desc' }).limit(3);
        res.json(books);
    } catch(error) {
        console.error(error.message);
        res.status(500).json({ error });
    }
};

//Update
  //update a book
exports.updateOneBook = async (req, res) => {
    const book = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename.replace(/\.jpeg|\.jpg|\.png/g, "_")}thumbnail.webp`,
  } : {...req.body};
    delete book._userId;
    Book.findOne({ _id: req.params.id, userId: req.auth.userId })
        .then((foundBook) => {
            if (!foundBook) {
                return res.status(404).json({ message: "Livre non trouvé" });
            }
            Book.updateOne({ _id: req.params.id }, book)
            .then(() => {
              deleteImgFile(foundBook);
              res.status(200).json({ message: "Livre modifié !" });
          })
                .catch(error => res.status(500).json({ error: "Erreur lors de la mise à jour du livre" }));
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};
  
//Delete
  //delete a book
exports.deleteOneBook = async (req, res) => {
  Book.findOne({ _id: req.params.id})
  .then(book => {
    if(thing.userId != req.auth.userId){
      res.status(401).json({message: 'Non-autorisé'});
    } else {
      const filename = book.imageURL.split('/images/')[1];
      fs.unlink(`images/${filename}`, ()=> {
        book.deleteOne('_id: req.params.id')
        .then(() => { res.status(200).json({message: 'Livre supprimé !'})})
        .catch(error => res.status(401).json({ error}));
      })
    }
  })
  .catch(error => {
    res.status(500).json({error});
  })
};