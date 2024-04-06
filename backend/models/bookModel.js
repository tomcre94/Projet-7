const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    imageURL: { type: String },
    ratings: [{ type: Number }],
});

module.exports = mongoose.model('Book', bookSchema);
