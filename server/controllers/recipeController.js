const pool = require('./server').pool;
const authMiddleware = require('../middleware/authMiddleware');

const getAllRecipes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM recipes');
    const recipes = result.rows;
    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching recipes');
  }
};

const getRecipeById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM recipes WHERE recipe_id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const recipe = result.rows[0];

    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching recipe by ID');
  }
};

const getUserRecipes = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query('SELECT * FROM recipes WHERE user_id = $1', [userId]);
    const userRecipes = result.rows;

    res.json(userRecipes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching user-specific recipes');
  }
};

const searchByMealType = async (req, res) => {
  const { mealType } = req.params;

  try {
    const result = await pool.query('SELECT * FROM recipes WHERE meal_type = $1', [mealType]);
    const recipes = result.rows;

    res.json(recipes);
  } catch (error) {
    console.error('Error searching recipes by meal type:', error);
    res.status(500).json({ error: 'An error occurred while searching recipes by meal type' });
  }
};

const searchByDietaryRestriction = async (req, res) => {
  const { dietaryRestriction } = req.params;

  try {
    const result = await pool.query('SELECT * FROM recipes WHERE dietary_restriction = $1', [dietaryRestriction]);
    const recipes = result.rows;

    res.json(recipes);
  } catch (error) {
    console.error('Error searching recipes by dietary restriction:', error);
    res.status(500).json({ error: 'An error occurred while searching recipes by dietary restriction' });
  }
};

const searchByMovieGenre = async (req, res) => {
  const { movieGenre } = req.params;

  try {
    const result = await pool.query('SELECT * FROM recipes WHERE movie_genre = $1', [movieGenre]);
    const recipes = result.rows;

    res.json(recipes);
  } catch (error) {
    console.error('Error searching recipes by movie genre:', error);
    res.status(500).json({ error: 'An error occurred while searching recipes by movie genre' });
  }
};

const searchRecipes = async (req, res) => {
  const { searchTerm } = req.params;

  try {
    let result;
    result = await pool.query('SELECT * FROM recipes WHERE LOWER(title) LIKE $1', [`%${searchTerm.toLowerCase()}%`]);

    const recipes = result.rows;
    res.json(recipes);
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({ error: 'An error occurred while searching recipes' });
  }
};

const addRecipeWithoutImage = async (req, res) => {
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
    res.status(500).send('Error creating a new recipe without image');
  }
};

const addRecipeWithImage = async (req, res) => {
  const { title, ingredients, instructions, movie_title, imageUrl } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO recipes (title, ingredients, instructions, movie_title, image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, ingredients, instructions, movie_title, imageUrl]
    );
    const newRecipe = result.rows[0];
    res.status(201).json(newRecipe);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating a new recipe with image');
  }
};

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded.' });
    }

    const filename = req.file.filename;
    const image = `http://localhost:5000/upload-image/${filename}`;

    const recipe_id = req.body.recipe_id;
    const updateQuery = 'UPDATE recipes SET image = $1 WHERE recipe_id = $2';
    await pool.query(updateQuery, [image, recipe_id]);

    res.json({ image });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateRecipe = async (req, res) => {
  const { id } = req.params;
  const { field, value } = req.body;

  try {
    let updateQuery = `UPDATE recipes SET ${field} = $1 WHERE recipe_id = $2 RETURNING *`;
    const queryParams = [value, id];

    if (field === 'image' && req.file) {
      const newImageFilename = req.file.filename;
      // *update later with image hosting url
      const newImageUrl = `http://localhost:5000/upload-image/${newImageFilename}`;

      updateQuery = `UPDATE recipes SET image = $1 WHERE recipe_id = $2 RETURNING *`;
      queryParams[0] = newImageUrl;
    }

    const updateResult = await pool.query(updateQuery, queryParams);
    const updatedRecipe = updateResult.rows[0];

    res.json(updatedRecipe);
  } catch (err) {
    console.error('Error updating the recipe:', err);
    res.status(500).send('Error updating the recipe');
  }
};

const deleteRecipe = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM recipes WHERE recipe_id = $1 RETURNING *', [id]);
    const deletedRecipe = result.rows[0];
    res.json(deletedRecipe);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting the recipe');
  }
};

const saveRecipe = async (req, res) => {
  const userId = req.user.id;
  const { recipeId } = req.body;

  try {
    const existingSavedRecipe = await pool.query(
      'SELECT * FROM saved_recipes WHERE user_id = $1 AND recipe_id = $2',
      [userId, recipeId]
    );

    if (existingSavedRecipe.rows.length > 0) {
      return res.status(400).send('Recipe already saved by the user');
    }

    await pool.query('INSERT INTO saved_recipes (user_id, recipe_id) VALUES ($1, $2)', [userId, recipeId]);
    res.status(201).send('Recipe saved successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving recipe');
  }
};


const unsaveRecipe = async (req, res) => {
  const userId = req.user.id;
  const { recipeId } = req.body;

  try {
    await pool.query('DELETE FROM saved_recipes WHERE user_id = $1 AND recipe_id = $2', [userId, recipeId]);
    res.status(200).send('Recipe unsaved successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error unsaving recipe');
  }
};

const getSavedRecipes = async (req, res) => {
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

    console.log(savedRecipes)
    res.json(savedRecipes);
  } catch (error) {
    console.error('Error fetching saved recipes:', error);
    res.status(500).json({ error: 'An error occurred while fetching saved recipes' });
  }
};

const checkSavedRecipe = async (req, res) => {
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
};

const likeRecipe = async (req, res) => {
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
};

const dislikeRecipe = async (req, res) => {
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
};

const deleteLike = async (req, res) => {
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

    res.status(200).json({ message: 'Like deleted successfully' });
  } catch (error) {
    console.error('Error deleting like:', error);
    res.status(500).json({ error: 'Error deleting like' });
  }
};

const deleteDislike = async (req, res) => {
  const { user_id, recipe_id } = req.body;

  try {
    await pool.query(
      'DELETE FROM recipe_likes WHERE user_id = $1 AND recipe_id = $2 AND interaction_type = $3',
      [user_id, recipe_id, 'dislike']
    );

    await pool.query(
      // 'UPDATE recipes SET dislikes = CASE WHEN dislikes > 0 THEN dislikes - 1 ELSE 0 END WHERE recipe_id = $1',
      'UPDATE recipes SET dislikes = dislikes - 1 WHERE recipe_id = $1',
      [recipe_id]
    );

    res.status(200).json({ message: 'Dislike deleted successfully' });
  } catch (error) {
    console.error('Error deleting dislike:', error);
    res.status(500).json({ error: 'Error deleting dislike' });
  }
};

const checkLikedRecipe = async (req, res) => {
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
};

const checkDislikedRecipe = async (req, res) => {
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
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  getUserRecipes,
  addRecipeWithImage,
  addRecipeWithoutImage,
  updateRecipe,
  deleteRecipe,
  uploadImage,
  searchByMealType,
  searchByDietaryRestriction,
  searchByMovieGenre,
  searchRecipes,
  saveRecipe,
  unsaveRecipe,
  getSavedRecipes,
  checkSavedRecipe,
  likeRecipe,
  dislikeRecipe,
  deleteLike,
  deleteDislike,
  checkLikedRecipe,
  checkDislikedRecipe,
};

