const express = require('express');
const auth = require('auth');
const router = express.Router();

const bookCtrl = require('../controllers/bookController');

router.get('/', auth, bookCtrl.createBook);
router.get('/', auth, bookCtrl.getOneBook);
router.get('/', auth, bookCtrl.getAllBooks);
router.get('/', auth, bookCtrl.updateOneBook);
router.get('/', auth, bookCtrl.deleteOneBook);

// ajouter id quand nécessaire 
module.exports = router;