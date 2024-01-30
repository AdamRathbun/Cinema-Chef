
const express = require('express');
const { Pool } = require('pg');
const config = require('./config');

const app = express();
const port = 5000;

app.use(express.json());

const pool = new Pool({
  user: config.postgresUser,
  host: config.postgresHost,
  database: config.postgresDatabase,
  password: config.postgresPassword,
  port: config.postgresPort,
});

app.get('/test-db-connection', async (req, res) => {
  try {
    const client = await pool.connect();
    res.send('Database connection successful');
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error connecting to the database');
  }
});

app.get('/recipes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM recipes');
    const recipes = result.rows;
    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching recipes');
  }
});

app.post('/recipes', async (req, res) => {
  const { title, ingredients, instructions, movie_title } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO recipes (title, ingredients, instructions, movie_title) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, ingredients, instructions, movie_title]
    );
    const newRecipe = result.rows[0];
    res.status(201).json(newRecipe);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating a new recipe');
  }
});

app.put('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  const { title, ingredients, instructions, movie_title } = req.body;
  try {
    const result = await pool.query(
      'UPDATE recipes SET title = $1, ingredients = $2, instructions = $3, movie_title = $4 WHERE recipe_id = $5 RETURNING *',
      [title, ingredients, instructions, movie_title, id]
    );
    const updatedRecipe = result.rows[0];
    res.json(updatedRecipe);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating the recipe');
  }
});

app.delete('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM recipes WHERE recipe_id = $1 RETURNING *', [id]);
    const deletedRecipe = result.rows[0];
    res.json(deletedRecipe);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting the recipe');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
