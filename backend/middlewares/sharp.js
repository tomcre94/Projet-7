const sharp = require('sharp');

const optimizeImageSize = async (req, res, next) => {
    try {
        if (!req.file) {
            return next();
        }

        const acceptedExtensions = ['.jpeg', '.jpg', '.png'];
        const fileExtension = req.file.originalname.slice(-4).toLowerCase();
        if (!acceptedExtensions.includes(fileExtension)) {
            throw new Error('Format de fichier non pris en charge');
        }

        const resizedImagePath = req.file.path.replace(fileExtension, "_thumbnail.webp");
        await sharp(req.file.path)
            .resize({ height: 500 })
            .webp({ quality: 80 })
            .toFile(resizedImagePath);

        req.optimizedImage = resizedImagePath;
        next();
    } catch (error) {
        next(error); 
    }
};

module.exports = optimizeImageSize;
