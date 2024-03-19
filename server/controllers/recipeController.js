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
  const { title, ingredients, instructions, movie_title } = req.body;

  try {
    let updateQuery = 'UPDATE recipes SET';
    const queryParams = [];

    if (title) {
      updateQuery += ' title = $1,';
      queryParams.push(title);
    }

    if (ingredients) {
      updateQuery += ' ingredients = $2,';
      queryParams.push(ingredients);
    }

    if (instructions) {
      updateQuery += ' instructions = $3,';
      queryParams.push(instructions);
    }

    if (movie_title) {
      updateQuery += ' movie_title = $4,';
      queryParams.push(movie_title);
    }

    if (req.body.field === 'image' && req.body.image) {
      updateQuery += ' image = $5';
      queryParams.push(req.body.image);
    }

    updateQuery = updateQuery.replace(/,$/, '');

    updateQuery += ' WHERE recipe_id = $6 RETURNING *';
    queryParams.push(id);

    const result = await pool.query(updateQuery, queryParams);
    const updatedRecipe = result.rows[0];
    res.json(updatedRecipe);
  } catch (err) {
    console.error(err);
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
};

