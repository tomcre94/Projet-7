const express = require('express');
const router = express.Router();
const Book = require('../models/bookModel');

const bookCtrl = require('../controllers/bookController');

router.get('/', bookCtrl.createBook);
router.get('/', bookCtrl.getOneBook);
router.get('/', bookCtrl.getAllBooks);
router.get('/', bookCtrl.updateOneBook);
router.get('/', bookCtrl.deleteOneBook);

module.exports = router;