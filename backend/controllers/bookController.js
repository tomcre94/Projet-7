const Book = require('../models/bookModel');

//Create
//create and save new book 
exports.createBook = async(req, res) => {
try { 
    delete req.body._id;
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        imageURL: req.body.imageURL,
        year: req.body.year,
        genre: req.body.genre,
        ratings: req.body.ratings
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
    try {
      const result = await Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id });
      if (result.nModified === 0) {
        return res.status(404).json({ message: "Livre non trouvé" });
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
      const result = await Book.deleteOne({ _id: req.params.id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }
      res.status(200).json({ message: "Livre supprimé !" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la suppression du livre" });
    }
  };
  