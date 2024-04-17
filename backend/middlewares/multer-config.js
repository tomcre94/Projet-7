const multer = require('multer');
const fs = require('fs');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const deleteImage = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(
        "Erreur lors de la suppression de l'image précédente :",
        err
      );
    }
  });
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    if (req.filepath) {
      deleteImage(req.filepath);
    }
    req.filepath = 'images/' + name + Date.now() + '.' + extension;
    callback(null, name + Date.now() + '.' + extension);
  },
});

module.exports = multer({ storage }).single('image');
