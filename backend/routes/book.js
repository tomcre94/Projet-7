const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const bookCtrl = require('../controllers/bookController');
const sharp = require('../middlewares/sharp');

//Create
router.post('/', auth, multer, sharp, bookCtrl.createBook);
router.post('/:id/rating', auth, bookCtrl.createRatingBook);

//Read
router.get('/:id', bookCtrl.getOneBook);
router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.bestRating);

//Update
router.put('/:id', auth, multer, sharp, bookCtrl.updateOneBook);

//Delete
router.delete('/:id', auth, bookCtrl.deleteOneBook);

module.exports = router;