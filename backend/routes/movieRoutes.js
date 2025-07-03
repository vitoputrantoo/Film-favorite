const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/', movieController.getFavoriteMovies);
router.post('/', movieController.addFavoriteMovie);
router.delete('/:id', movieController.deleteFavoriteMovie); // ':id' adalah ID dari DB kita

module.exports = router;