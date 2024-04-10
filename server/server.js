const express = require('express');
const { Pool } = require('pg');
const config = require('./config');
const cors = require('cors')
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const authController = require('./controllers/authController');
const { authenticateToken } = require('./middleware/authMiddleware');
const movieController = require('./controllers/movieController');

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
      'SELECT * FROM recipes ORDER BY likes DESC LIMIT 30'
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

app.get('/user-recipes', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query('SELECT * FROM recipes WHERE user_id = $1', [userId]);
    const userRecipes = result.rows;

    res.json(userRecipes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching user-specific recipes');
  }
});

app.get('/recipes/meal-type/:mealType', async (req, res) => {
  const { mealType } = req.params;

  try {
    const result = await pool.query('SELECT * FROM recipes WHERE meal_type = $1', [mealType]);
    const recipes = result.rows;

    res.json(recipes);
  } catch (error) {
    console.error('Error searching recipes by meal type:', error);
    res.status(500).json({ error: 'An error occurred while searching recipes by meal type' });
  }
});

app.get('/recipes/dietary-restriction/:dietaryRestriction', async (req, res) => {
  const { dietaryRestriction } = req.params;

  try {
    const result = await pool.query('SELECT * FROM recipes WHERE dietary_restriction = $1', [dietaryRestriction]);
    const recipes = result.rows;

    res.json(recipes);
  } catch (error) {
    console.error('Error searching recipes by dietary restriction:', error);
    res.status(500).json({ error: 'An error occurred while searching recipes by dietary restriction' });
  }
});

app.get('/recipes/movie-genre/:movieGenre', async (req, res) => {
  const { movieGenre } = req.params;

  try {
    const result = await pool.query('SELECT * FROM recipes WHERE movie_genre = $1', [movieGenre]);
    const recipes = result.rows;

    res.json(recipes);
  } catch (error) {
    console.error('Error searching recipes by movie genre:', error);
    res.status(500).json({ error: 'An error occurred while searching recipes by movie genre' });
  }
});

app.get('/recipes/search/recipe-name/:searchTerm', async (req, res) => {
  const { searchTerm } = req.params;

  try {
    let result;
    result = await pool.query('SELECT * FROM recipes WHERE LOWER(title) LIKE $1', [`%${searchTerm.toLowerCase()}%`]);

    const recipes = result.rows;
    res.json(recipes);
  } catch (err) {
    console.error('Error searching recipes:', err);
    res.status(500).send('Error fetching recipes');
  }
});

// *need to update later with image hosting url
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

app.post('/recipes-with-image', authenticateToken, upload.single('image'), async (req, res) => {
  const { title, ingredients, instructions, movie_title, imageUrl, meal_type, dietary_restriction, movie_genre, description, prep_time } = req.body;

  const userId = req.user.id;

  try {
    const result = await pool.query(
      'INSERT INTO recipes (title, ingredients, instructions, movie_title, image, user_id, meal_type, dietary_restriction, movie_genre, description, prep_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [title, ingredients, instructions, movie_title, imageUrl, userId, meal_type, dietary_restriction, movie_genre, description, prep_time]
    );

    const newRecipe = result.rows[0];

    res.status(201).json(newRecipe);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating a new recipe');
  }
});

app.post('/recipes-without-image', authenticateToken, upload.none(), async (req, res) => {
  const { title, ingredients, instructions, movie_title, meal_type, dietary_restriction, movie_genre, description, prep_time } = req.body;

  const userId = req.user.id;

  try {
    const result = await pool.query(
      'INSERT INTO recipes (title, ingredients, instructions, movie_title, user_id, meal_type, dietary_restriction, movie_genre, description, prep_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [title, ingredients, instructions, movie_title, userId, meal_type, dietary_restriction, movie_genre, description, prep_time]
    );

    const newRecipe = result.rows[0];

    res.status(201).json(newRecipe);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating a new recipe');
  }
});

app.post('/save-recipe', async (req, res) => {
  const { user_id, recipe_id } = req.body;

  try {
    const existingSavedRecipe = await pool.query(
      'SELECT * FROM saved_recipes WHERE user_id = $1 AND recipe_id = $2',
      [user_id, recipe_id]
    );

    if (existingSavedRecipe.rows.length > 0) {
      return res.status(400).json({ error: 'Recipe already saved by the user' });
    }

    const result = await pool.query(
      'INSERT INTO saved_recipes (user_id, recipe_id) VALUES ($1, $2) RETURNING *',
      [user_id, recipe_id]
    );

    const savedRecipe = result.rows[0];
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error('Error saving recipe:', error);
    res.status(500).json({ error: 'Error saving recipe' });
  }
});

app.delete('/unsave-recipe', async (req, res) => {
  const { user_id, recipe_id } = req.body;

  try {
    const result = await pool.query(
      'DELETE FROM saved_recipes WHERE user_id = $1 AND recipe_id = $2 RETURNING *',
      [user_id, recipe_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Recipe not found in saved recipes' });
    }

    res.status(200).json({ message: 'Recipe successfully removed from saved recipes' });
  } catch (error) {
    console.error('Error unsaving recipe:', error);
    res.status(500).json({ error: 'Error unsaving recipe' });
  }
});

app.get('/saved-recipes', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const query = {
      text: `
        SELECT recipes.*
        FROM recipes
        JOIN saved_recipes ON recipes.recipe_id = saved_recipes.recipe_id
        WHERE saved_recipes.user_id = $1
      `,
      values: [userId],
    };

    const result = await pool.query(query);
    const savedRecipes = result.rows;

    res.json(savedRecipes);
  } catch (error) {
    console.error('Error fetching saved recipes:', error);
    res.status(500).json({ error: 'An error occurred while fetching saved recipes' });
  }
});

app.get('/check-saved-recipe', async (req, res) => {
  const { user_id, recipe_id } = req.query;

  try {
    const savedRecipe = await pool.query(
      'SELECT * FROM saved_recipes WHERE user_id = $1 AND recipe_id = $2',
      [user_id, recipe_id]
    );

    res.status(200).json({ saved: savedRecipe.rows.length > 0 });
  } catch (error) {
    console.error('Error checking saved recipe:', error);
    res.status(500).json({ error: 'Error checking saved recipe' });
  }
});

app.post('/like-recipe', async (req, res) => {
  const { user_id, recipe_id } = req.body;

  try {
    const existingLike = await pool.query(
      'SELECT * FROM recipe_likes WHERE user_id = $1 AND recipe_id = $2 AND interaction_type = $3',
      [user_id, recipe_id, 'like']
    );

    if (existingLike.rows.length > 0) {
      return res.status(400).json({ error: 'User has already liked this recipe' });
    }

    await pool.query(
      'INSERT INTO recipe_likes (user_id, recipe_id, interaction_type) VALUES ($1, $2, $3)',
      [user_id, recipe_id, 'like']
    );

    await pool.query(
      'UPDATE recipes SET likes = likes + 1 WHERE recipe_id = $1',
      [recipe_id]
    );

    res.status(200).json({ message: 'Recipe liked successfully' });
  } catch (error) {
    console.error('Error liking recipe:', error);
    res.status(500).json({ error: 'Error liking recipe' });
  }
});


app.post('/dislike-recipe', async (req, res) => {
  const { user_id, recipe_id } = req.body;

  try {
    const existingDislike = await pool.query(
      'SELECT * FROM recipe_likes WHERE user_id = $1 AND recipe_id = $2 AND interaction_type = $3',
      [user_id, recipe_id, 'dislike']
    );

    if (existingDislike.rows.length > 0) {
      return res.status(400).json({ error: 'User has already disliked this recipe' });
    }

    await pool.query(
      'INSERT INTO recipe_likes (user_id, recipe_id, interaction_type) VALUES ($1, $2, $3)',
      [user_id, recipe_id, 'dislike']
    );

    await pool.query(
      'UPDATE recipes SET dislikes = dislikes + 1 WHERE recipe_id = $1',
      [recipe_id]
    );

    res.status(200).json({ message: 'Recipe disliked successfully' });
  } catch (error) {
    console.error('Error disliking recipe:', error);
    res.status(500).json({ error: 'Error disliking recipe' });
  }
});

app.post('/delete-like', async (req, res) => {
  const { user_id, recipe_id } = req.body;

  try {
    await pool.query(
      'DELETE FROM recipe_likes WHERE user_id = $1 AND recipe_id = $2 AND interaction_type = $3',
      [user_id, recipe_id, 'like']
    );

    await pool.query(
      'UPDATE recipes SET likes = CASE WHEN likes > 0 THEN likes - 1 ELSE 0 END WHERE recipe_id = $1',
      [recipe_id]
    );

    res.status(200).json({ message: 'like deleted successfully' });
  } catch (error) {
    console.error('Error deleting like:', error);
    res.status(500).json({ error: 'Error deleting like' });
  }
});

app.post('/delete-dislike', async (req, res) => {
  const { user_id, recipe_id } = req.body;

  try {
    await pool.query(
      'DELETE FROM recipe_likes WHERE user_id = $1 AND recipe_id = $2 AND interaction_type = $3',
      [user_id, recipe_id, 'dislike']
    );

    await pool.query(
      'UPDATE recipes SET dislikes = dislikes - 1 WHERE recipe_id = $1',
      [recipe_id]
    );

    res.status(200).json({ message: 'Dislike deleted successfully' });
  } catch (error) {
    console.error('Error deleting dislike:', error);
    res.status(500).json({ error: 'Error deleting dislike' });
  }
});

app.get('/check-liked-recipe', async (req, res) => {
  const { user_id, recipe_id } = req.query;

  try {
    const result = await pool.query(
      'SELECT * FROM recipe_likes WHERE user_id = $1 AND recipe_id = $2 AND interaction_type = $3',
      [user_id, recipe_id, 'like']
    );

    res.status(200).json({ liked: result.rows.length > 0 });
  } catch (error) {
    console.error('Error checking liked recipe:', error);
    res.status(500).json({ error: 'Error checking liked recipe' });
  }
});

app.get('/check-disliked-recipe', async (req, res) => {
  const { user_id, recipe_id } = req.query;

  try {
    const result = await pool.query(
      'SELECT * FROM recipe_likes WHERE user_id = $1 AND recipe_id = $2 AND interaction_type = $3',
      [user_id, recipe_id, 'dislike']
    );

    res.status(200).json({ disliked: result.rows.length > 0 });
  } catch (error) {
    console.error('Error checking disliked recipe:', error);
    res.status(500).json({ error: 'Error checking disliked recipe' });
  }
});

app.put('/recipes/:id', authenticateToken, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const existingRecipeResult = await pool.query('SELECT * FROM recipes WHERE recipe_id = $1', [id]);
    const existingRecipe = existingRecipeResult.rows[0];

    if (!existingRecipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    if (existingRecipe.user_id !== userId) {
      return res.status(403).json({ message: 'Cannot update the recipe if you are not the creator.' });
    }

    if (req.file && req.body.field === 'image') {
      const oldImageUrl = existingRecipe.image;
      if (oldImageUrl) {
        const oldImagePath = path.join(__dirname, 'upload-image', path.basename(oldImageUrl));
        try {
          await fs.unlink(oldImagePath);
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
      meal_type: 'meal_type',
      dietary_restriction: 'dietary_restriction',
      movie_genre: 'movie_genre',
      description: 'description',
      prep_time: 'prep_time',
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

      const updateResult = await pool.query(updateQuery, queryParams);
      const updatedRecipe = updateResult.rows[0];

      return res.json(updatedRecipe);
    }

    const updateQuery = `UPDATE recipes SET ${column} = $1 WHERE recipe_id = $2 RETURNING *`;
    const queryParams = [value, id];

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
  const userId = req.user.id;

  try {
    const result = await pool.query('SELECT * FROM recipes WHERE recipe_id = $1', [id]);
    const recipeToDelete = result.rows[0];

    if (!recipeToDelete) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    if (recipeToDelete.user_id !== userId) {
      return res.status(403).json({ message: 'Cannot delete recipe if you are not the creator.' });
    }

    const deleteResult = await pool.query('DELETE FROM recipes WHERE recipe_id = $1 RETURNING *', [id]);
    const deletedRecipe = deleteResult.rows[0];

    const imageUrl = deletedRecipe.image;

    // *Need to update later with image hosting: Deletes the image from the server
    if (imageUrl) {
      const imagePath = path.join(__dirname, 'upload-image', path.basename(imageUrl));

      await fs.unlink(imagePath);
      console.log('Image file deleted from server:', imagePath);
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

app.get('/api/movies/search', movieController.searchMoviesByName);

app.listen(port, () => {
  // need to update later
  console.log(`Server is running on http://localhost:${port}`);
});

