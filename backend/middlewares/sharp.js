const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const optimizeImageSize = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }
    const newFilename = req.file.filename.replace(/\.[^.]+$/, '.webp');
    const outputPath = path.join(__dirname, '../public/images/', newFilename);

    sharp.cache(false);
    await sharp(req.file.path)
      .resize({ height: 500 })
      .webp({ quality: 80 })
      .toFile(outputPath);

    // Supprimer le fichier temporaire après traitement
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error(
          'Erreur lors de la suppression du fichier temporaire :',
          err
        );
      }
    });

    // Mettre à jour les informations du fichier
    req.file.path = outputPath;
    req.file.filename = newFilename;
    req.file.mimetype = 'image/webp';

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = optimizeImageSize;
