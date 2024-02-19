const express = require('express');
const { Pool } = require('pg');
const config = require('./config');
const cors = require('cors')
const multer = require('multer');
const path = require('path');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors())

const pool = new Pool({
  user: config.postgresUser,
  host: config.postgresHost,
  database: config.postgresDatabase,
  password: config.postgresPassword,
  port: config.postgresPort,
});

// need to update later
app.use('/upload-image', express.static(path.join(__dirname, 'upload-image')));

// need to update storage location later
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload-image/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  },
});

const upload = multer({ storage });

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

app.get('/top-liked-recipes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM recipes ORDER BY likes DESC LIMIT 50'
    );

    const topLikedRecipes = result.rows;

    res.json(topLikedRecipes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching top liked recipes');
  }
});

app.get('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM recipes WHERE recipe_id = $1', [id]);
    const recipe = result.rows[0];
    if (!recipe) {
      return res.status(404).send('Recipe not found');
    }
    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching recipe');
  }
});

// need to update later with image hosting url
app.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    console.log('Received image upload request');

    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded.' });
    }

    const filename = req.file.filename;

    const imageUrl = `http://localhost:5000/upload-image/${filename}`;

    res.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/recipes', upload.none(), async (req, res) => {
  const { title, ingredients, instructions, movie_title, imageUrl } = req.body;
  try {
    console.log('Received data for new recipe:', { title, ingredients, instructions, movie_title, imageUrl });

    const result = await pool.query(
      'INSERT INTO recipes (title, ingredients, instructions, movie_title, image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, ingredients, instructions, movie_title, imageUrl]
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
