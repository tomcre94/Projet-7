const multer = require('multer');
const fs = require('fs');
const moment = require('moment');

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
    callback(null, 'public/images');
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    if (req.filepath) {
      deleteImage(req.filepath);
    }
    const formattedDate = moment().format('YYYY-MM-DD');
    const uniqueFilename = `${formattedDate}-${Date.now()}.${extension}`;
    req.filepath = `images/${uniqueFilename}`;
    callback(null, uniqueFilename);
  },
});

module.exports = multer({ storage }).single('image');
