const axios = require('axios');
// const config = require('../config');

// const apiKey = config.tmdbApiKey;
const apiKey = process.env.tmdbApiKey;
const apiUrl = 'https://api.themoviedb.org/3/search/movie';

const searchMoviesByName = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Missing required parameter: name' });
  }

  try {
    const response = await axios.get(`${apiUrl}?api_key=${apiKey}&query=${name}`);
    const movies = response.data.results;
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies by name:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  searchMoviesByName,
};
