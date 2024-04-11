const Book = require('../models/bookModel');
const fs = require('fs');

//Create
//create and save new book 
exports.createBook = async(req, res) => {
try {
    const bookObject = JSON.parse(req.body.book);
    delete req.body._id;
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        imageURL: req.body.imageURL,
        year: req.body.year,
        genre: req.body.genre,
        ratings: req.body.ratings,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename.replace(/\.jpeg|\.jpg|\.png/g, "_")}thumbnail.webp`
    });
    await book.save();
    res.status(201).json({ message: 'Livre enregistré !'})
} catch(error) {res.status(400).json({ error })};
}

//Create rating

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
  