const express = require('express');
const { Pool } = require('pg');
const config = require('./config');
const cors = require('cors')
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const authController = require('./controllers/authController');
const { authenticateToken } = require('./middleware/authMiddleware');


const app = express();
const port = 5000;

app.use(express.json());
app.use(cors())

// need to update later
app.use('/upload-image', express.static(path.join(__dirname, 'upload-image')));

const pool = new Pool({
  user: config.postgresUser,
  host: config.postgresHost,
  database: config.postgresDatabase,
  password: config.postgresPassword,
  port: config.postgresPort,
});

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
app.post('/upload-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
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

app.post('/recipes', authenticateToken, upload.none(), async (req, res) => {
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

app.put('/recipes/:id', authenticateToken, upload.single('image'), async (req, res) => {
  const { id } = req.params;

  try {
    const existingRecipeResult = await pool.query('SELECT * FROM recipes WHERE recipe_id = $1', [id]);
    const existingRecipe = existingRecipeResult.rows[0];

    if (!existingRecipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    console.log('Received Field:', req.body.field);

    if (req.file && req.body.field === 'image') {
      const oldImageUrl = existingRecipe.image;
      if (oldImageUrl) {
        const oldImagePath = path.join(__dirname, 'upload-image', path.basename(oldImageUrl));
        try {
          await fs.unlink(oldImagePath);
          console.log('Old image file deleted from server:', oldImagePath);
        } catch (error) {
          console.error('Error deleting old image file:', error);
          throw error;
        }
      }
    }

    const fieldToColumnMap = {
      title: 'title',
      ingredients: 'ingredients',
      instructions: 'instructions',
      movie_title: 'movie_title',
      image: 'image',
    };

    const { field, value } = req.body;
    const column = fieldToColumnMap[field];

    if (!column) {
      console.error(`Error updating the recipe: Unknown field - ${field}`);
      return res.status(400).send('Unknown field');
    }

    if (field === 'image' && req.file) {
      const newImageFilename = req.file.filename;
      // *update later with image hosting url
      const newImageUrl = `http://localhost:5000/upload-image/${newImageFilename}`;

      const updateQuery = `UPDATE recipes SET ${column} = $1 WHERE recipe_id = $2 RETURNING *`;
      const queryParams = [newImageUrl, id];

      console.log('Update Query:', updateQuery);
      console.log('Query Parameters:', queryParams);

      const updateResult = await pool.query(updateQuery, queryParams);
      const updatedRecipe = updateResult.rows[0];

      return res.json(updatedRecipe);
    }

    const updateQuery = `UPDATE recipes SET ${column} = $1 WHERE recipe_id = $2 RETURNING *`;
    const queryParams = [value, id];

    console.log('Update Query:', updateQuery);
    console.log('Query Parameters:', queryParams);

    const updateResult = await pool.query(updateQuery, queryParams);
    const updatedRecipe = updateResult.rows[0];

    return res.json(updatedRecipe);
  } catch (err) {
    console.error('Error updating the recipe:', err);
    return res.status(500).send('Error updating the recipe');
  }
});

app.delete('/recipes/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM recipes WHERE recipe_id = $1 RETURNING *', [id]);
    const deletedRecipe = result.rows[0];

    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    const imageUrl = deletedRecipe.image;

    // *Need to update later with image hosting: Deletes the image from the server
    if (imageUrl) {
      const imagePath = path.join(__dirname, 'upload-image', path.basename(imageUrl));

      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.error('Error deleting image file:', error);
      }
    } else {
      console.log('Recipe has no image to delete.');
    }

    res.json(deletedRecipe);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting the recipe');
  }
});

app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

