const sharp = require('sharp');
const fs = require('fs');

const optimizeImageSize = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }
    const newFilename = req.file.filename.replace(/\.[^.]+$/, '.webp');
    await sharp(req.file.path)
      .resize({ height: 500 })
      .webp({ quality: 80 })
      .toFile(`images/${newFilename}`);
    req.optimizedImage = optimizedImagePath;
    fs.unlinkSync(req.file.path);
    req.file.path = `images/${newFilename}`;
    req.file.filename = newFilename;
    req.file.mimetype = 'image/webp';
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = optimizeImageSize;
