const express = require('express');
const router = express.Router();
const auth = require('auth');
const multer = require('../middlewares/multer-config');
const bookCtrl = require('../controllers/bookController');

router.get('/', auth, multer, bookCtrl.createBook);
router.get('/:id', auth, bookCtrl.getOneBook);
router.get('/', auth, bookCtrl.getAllBooks);
router.get('/:id', auth, multer, bookCtrl.updateOneBook);
router.get('/:id', auth, bookCtrl.deleteOneBook);

module.exports = router;