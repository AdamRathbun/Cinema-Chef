const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/api/movies/search', movieController.searchMoviesByName);

module.exports = router;