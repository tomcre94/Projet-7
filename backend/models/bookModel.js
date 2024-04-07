const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageURL: { type: String },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [
        {
          userId: { type: String, required: true },
          grade: { type: Number, min: 1, max: 5, required: true },
        },
      ],
});

module.exports = mongoose.model('Book', bookSchema);
