// sample data to be replaced with PostgreSQL db
// Sample data (replace with actual database queries)
const movies = [
  { id: 101, title: "Pulp Fiction", genre: "Crime" },
  { id: 102, title: "Mad Max: Fury Road", genre: "Apocalyptic" }
];

const getAllMovies = (req, res) => {
  res.json(movies);
};

const getMovieById = (req, res) => {
  const { id } = req.params;
  const movie = movies.find((m) => m.id === parseInt(id));
  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }
  res.json(movie);
};

const addMovie = (req, res) => {
  const { title, genre } = req.body;
  const newMovie = { id: movies.length + 1, title, genre };
  movies.push(newMovie);
  res.status(201).json(newMovie);
};

const updateMovie = (req, res) => {
  const { id } = req.params;
  const { title, genre } = req.body;
  const index = movies.findIndex((m) => m.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ error: 'Movie not found' });
  }
  movies[index] = { id: parseInt(id), title, genre };
  res.json(movies[index]);
};

const deleteMovie = (req, res) => {
  const { id } = req.params;
  const index = movies.findIndex((m) => m.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ error: 'Movie not found' });
  }
  const deletedMovie = movies.splice(index, 1);
  res.json(deletedMovie[0]);
};

module.exports = {
  getAllMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie,
};