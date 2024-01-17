// sample data to be replaced with PostgreSQL db
// Sample data (replace with actual database queries)

// const movies = [
//   { id: 101, title: "Pulp Fiction", genre: "Crime" },
//   { id: 102, title: "Mad Max: Fury Road", genre: "Apocalyptic" }
// ];

const axios = require('axios');
const config = require('../config');

const apiKey = config.tmdbApiKey;
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

const getRecipesByMovieId = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch movie details by ID
    const movieResponse = await axios.get(`${apiUrl}/movie/${id}?api_key=${apiKey}`);
    const movie = movieResponse.data;

    // Fetch recipes related to the movie title, will need to implement logic to fetch recipes based on the movie title from db
    const recipes = [];

    res.json({ movie, recipes });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    console.error('Error fetching movie and recipes by ID:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  searchMoviesByName,
  getRecipesByMovieId,
};
