const express = require('express');
const cors = require('cors')
const path = require('path');
const fs = require('fs').promises;
const authController = require('./controllers/authController');
const { authenticateToken } = require('./middleware/authMiddleware');
const movieController = require('./controllers/movieController');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
// const config = require('./config');

const cloudinary = require('cloudinary').v2;
// const { cloudinaryConfig } = require('./config');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors())

// const supabase = createClient(config.supabaseURL, config.supabaseKey);

// cloudinary.config({
//   cloud_name: cloudinaryConfig.cloud_name,
//   api_key: cloudinaryConfig.api_key,
//   api_secret: cloudinaryConfig.api_secret,
//   secure: true,
// });

const supabase = createClient(process.env.supabaseURL, process.env.supabaseKey);

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
  secure: true,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'holding',
    allowedFormats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 1800, crop: 'scale' }],
  }
});

const upload = multer({ storage: storage });

app.get('/recipes', async (req, res) => {
  try {
    const { data: recipes, error } = await supabase.from('recipes').select('*');

    if (error) {
      console.error(error);
      return res.status(500).send('Error fetching recipes');
    }

    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching recipes');
  }
});

app.get('/top-liked-recipes', async (req, res) => {
  try {
    const { data: topLikedRecipes, error } = await supabase
      .from('recipes')
      .select('*')
      .order('likes', { ascending: false })
      .limit(100);

    if (error) {
      console.error(error);
      return res.status(500).send('Error fetching top liked recipes');
    }

    res.json(topLikedRecipes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching top liked recipes');
  }
});

app.get('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data: recipe, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('recipe_id', id)
      .single();

    if (error) {
      console.error(error);
      return res.status(500).send('Error fetching recipe');
    }

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
    const { data: userRecipes, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user-specific recipes:', error.message);
      return res.status(500).json({ error: 'Error fetching user-specific recipes' });
    }

    res.json(userRecipes);
  } catch (err) {
    console.error('Exception fetching user-specific recipes:', err.message);
    res.status(500).json({ error: 'Exception fetching user-specific recipes' });
  }
});

// good
app.get('/recipes/meal-type/:mealType', async (req, res) => {
  const { mealType } = req.params;

  try {
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('meal_type', mealType);

    if (error) {
      console.error(error);
      return res.status(500).send('Error searching recipes by meal type');
    }

    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error searching recipes by meal type');
  }
});

app.get('/recipes/dietary-restriction/:dietaryRestriction', async (req, res) => {
  const { dietaryRestriction } = req.params;

  try {
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('dietary_restriction', dietaryRestriction);

    if (error) {
      console.error(error);
      return res.status(500).send('Error searching recipes by dietary restriction');
    }

    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error searching recipes by dietary restriction');
  }
});

app.get('/recipes/movie-genre/:movieGenre', async (req, res) => {
  const { movieGenre } = req.params;

  try {
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('movie_genre', movieGenre);

    if (error) {
      console.error(error);
      return res.status(500).send('Error searching recipes by movie genre');
    }

    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error searching recipes by movie genre');
  }
});

app.get('/recipes/search/recipe-name/:searchTerm', async (req, res) => {
  const { searchTerm } = req.params;

  try {
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .ilike('title', `%${searchTerm}%`);

    if (error) {
      console.error('Error searching recipes:', error);
      return res.status(500).send('Error fetching recipes');
    }

    res.json(recipes);
  } catch (err) {
    console.error('Error searching recipes:', err);
    res.status(500).send('Error fetching recipes');
  }
});

app.post('/upload-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded.' });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    const imageUrl = result.secure_url;

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
    const { data: newRecipe, error } = await supabase
      .from('recipes')
      .insert({
        title,
        ingredients,
        instructions,
        movie_title,
        image: imageUrl,
        user_id: userId,
        meal_type,
        dietary_restriction,
        movie_genre,
        description,
        prep_time
      });

    if (error) {
      console.error('Error creating a new recipe:', error.message);
      return res.status(500).send('Error creating a new recipe');
    }

    res.status(201).json(newRecipe);
  } catch (err) {
    console.error('Error creating a new recipe:', err.message);
    res.status(500).send('Error creating a new recipe');
  }
});

app.post('/recipes-without-image', authenticateToken, upload.none(), async (req, res) => {
  const { title, ingredients, instructions, movie_title, meal_type, dietary_restriction, movie_genre, description, prep_time } = req.body;

  const userId = req.user.id;

  try {
    const { data: newRecipe, error } = await supabase
      .from('recipes')
      .insert({
        title,
        ingredients,
        instructions,
        movie_title,
        user_id: userId,
        meal_type,
        dietary_restriction,
        movie_genre,
        description,
        prep_time
      });

    if (error) {
      console.error('Error creating a new recipe:', error.message);
      return res.status(500).send('Error creating a new recipe');
    }

    res.status(201).json(newRecipe);
  } catch (err) {
    console.error('Error creating a new recipe:', err.message);
    res.status(500).send('Error creating a new recipe');
  }
});

app.post('/save-recipe', async (req, res) => {
  const { user_id, recipe_id } = req.body;

  try {
    const { data: existingSavedRecipes, error } = await supabase
      .from('saved_recipes')
      .select()
      .eq('user_id', user_id)
      .eq('recipe_id', recipe_id);

    if (error) {
      console.error('Error checking if recipe is already saved:', error.message);
      return res.status(500).json({ error: 'Error checking if recipe is already saved' });
    }

    if (existingSavedRecipes.length > 0) {
      return res.status(400).json({ message: 'Recipe already saved by the user' });
    }

    const { data: savedRecipe, insertError } = await supabase
      .from('saved_recipes')
      .insert([{ user_id, recipe_id }]);

    if (insertError) {
      console.error('Error saving recipe:', insertError.message);
      return res.status(500).json({ error: 'Error saving recipe' });
    }

    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error('Error during the save operation:', error.message);
    res.status(500).json({ error: 'Error during the save operation' });
  }
});

app.delete('/unsave-recipe', async (req, res) => {
  const { user_id, recipe_id } = req.body;

  try {
    const { error, count } = await supabase
      .from('saved_recipes')
      .delete()
      .eq('user_id', user_id)
      .eq('recipe_id', recipe_id);

    if (error) {
      console.error('Error unsaving recipe:', error.message);
      return res.status(500).json({ error: 'Error unsaving recipe' });
    }

    if (count === 0) {
      return res.status(404).json({ error: 'Recipe not found in saved recipes' });
    }

    res.status(200).json({ message: 'Recipe successfully removed from saved recipes' });
  } catch (error) {
    console.error('Error unsaving recipe:', error.message);
    res.status(500).json({ error: 'Error unsaving recipe' });
  }
});

app.get('/saved-recipes', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const { data: savedRecipes, error } = await supabase
      .from('recipes')
      .select('*')
      .in('recipe_id', (await supabase.from('saved_recipes').select('recipe_id').eq('user_id', userId)).data.map(row => row.recipe_id));

    if (error) {
      console.error('Error fetching saved recipes:', error.message);
      return res.status(500).json({ error: 'An error occurred while fetching saved recipes' });
    }

    res.json(savedRecipes);
  } catch (error) {
    console.error('Error fetching saved recipes:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching saved recipes' });
  }
});

app.get('/check-saved-recipe', async (req, res) => {
  const { user_id, recipe_id } = req.query;

  try {
    const { data, error } = await supabase
      .from('saved_recipes')
      .select('*')
      .eq('user_id', user_id)
      .eq('recipe_id', recipe_id);

    if (error) {
      console.error('Error checking saved recipe:', error.message);
      return res.status(500).json({ error: 'Error checking saved recipe' });
    }

    const isSaved = data.length > 0;
    res.status(200).json({ saved: isSaved });
  } catch (error) {
    console.error('Error checking saved recipe:', error.message);
    res.status(500).json({ error: 'Error checking saved recipe' });
  }
});

app.post('/like-recipe', async (req, res) => {
  const { user_id, recipe_id } = req.body;

  try {
    const { data: existingLikes, error: findError } = await supabase
      .from('recipe_likes')
      .select('*')
      .eq('user_id', user_id)
      .eq('recipe_id', recipe_id)
      .eq('interaction_type', 'like');

    if (findError) {
      console.error('Error checking existing likes:', findError.message);
      return res.status(500).json({ error: 'Error checking existing likes' });
    }

    if (existingLikes.length > 0) {
      return res.status(400).json({ error: 'User has already liked this recipe' });
    }

    const { error: insertError } = await supabase
      .from('recipe_likes')
      .insert([{ user_id, recipe_id, interaction_type: 'like' }]);

    if (insertError) {
      console.error('Error inserting like:', insertError.message);
      return res.status(500).json({ error: 'Error inserting like' });
    }

    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .select('likes')
      .eq('recipe_id', recipe_id)
      .single();

    if (recipeError) {
      console.error('Error fetching recipe:', recipeError.message);
      return res.status(500).json({ error: 'Error fetching recipe' });
    }

    const newLikesCount = recipe.likes + 1;
    const { error: updateError } = await supabase
      .from('recipes')
      .update({ likes: newLikesCount })
      .eq('recipe_id', recipe_id);

    if (updateError) {
      console.error('Error updating likes count:', updateError.message);
      return res.status(500).json({ error: 'Error updating likes count' });
    }

    res.status(200).json({ message: 'Recipe liked successfully' });
  } catch (error) {
    console.error('Error during like operation:', error.message);
    res.status(500).json({ error: 'Error during like operation' });
  }
});

app.post('/dislike-recipe', async (req, res) => {
  const { user_id, recipe_id } = req.body;

  try {
    const { data: existingDislike, error } = await supabase
      .from('recipe_likes')
      .select('*')
      .eq('user_id', user_id)
      .eq('recipe_id', recipe_id)
      .eq('interaction_type', 'dislike');

    if (error) {
      console.error('Error disliking recipe:', error.message);
      return res.status(500).json({ error: 'Error disliking recipe' });
    }

    if (existingDislike.length > 0) {
      return res.status(400).json({ error: 'User has already disliked this recipe' });
    }

    const { error: insertError } = await supabase.from('recipe_likes').insert([{ user_id, recipe_id, interaction_type: 'dislike' }]);
    if (insertError) {
      console.error('Error inserting dislike:', insertError.message);
      return res.status(500).json({ error: 'Error inserting dislike' });
    }

    const { data: recipeData, error: recipeError } = await supabase
      .from('recipes')
      .select('dislikes')
      .eq('recipe_id', recipe_id)
      .single();

    if (recipeError) {
      console.error('Error fetching recipe for dislikes:', recipeError.message);
      return res.status(500).json({ error: 'Error fetching recipe for dislikes' });
    }

    const newDislikesCount = (recipeData.dislikes || 0) + 1;

    const { error: updateError } = await supabase
      .from('recipes')
      .update({ dislikes: newDislikesCount })
      .eq('recipe_id', recipe_id);

    if (updateError) {
      console.error('Error updating dislikes:', updateError.message);
      return res.status(500).json({ error: 'Error updating dislikes' });
    }

    res.status(200).json({ message: 'Recipe disliked successfully' });
  } catch (error) {
    console.error('Error disliking recipe:', error.message);
    res.status(500).json({ error: 'Error disliking recipe' });
  }
});

app.post('/delete-like', async (req, res) => {
  const { user_id, recipe_id } = req.body;

  try {
    const { error: deleteError } = await supabase
      .from('recipe_likes')
      .delete()
      .match({ user_id, recipe_id, interaction_type: 'like' });

    if (deleteError) {
      console.error('Error deleting like:', deleteError.message);
      return res.status(500).json({ error: 'Error deleting like' });
    }

    const { data: recipe, error: fetchError } = await supabase
      .from('recipes')
      .select('likes')
      .eq('recipe_id', recipe_id)
      .single();

    if (fetchError) {
      console.error('Error fetching recipe:', fetchError.message);
      return res.status(500).json({ error: 'Error fetching recipe' });
    }

    const newLikesCount = Math.max(0, recipe.likes - 1);

    const { error: updateError } = await supabase
      .from('recipes')
      .update({ likes: newLikesCount })
      .eq('recipe_id', recipe_id);

    if (updateError) {
      console.error('Error updating likes:', updateError.message);
      return res.status(500).json({ error: 'Error updating likes' });
    }

    res.status(200).json({ message: 'Like deleted successfully' });
  } catch (error) {
    console.error('Error deleting like:', error.message);
    res.status(500).json({ error: 'Error deleting like' });
  }
});

app.post('/delete-dislike', async (req, res) => {
  const { user_id, recipe_id } = req.body;

  try {
    const { error: deleteError } = await supabase
      .from('recipe_likes')
      .delete()
      .match({ user_id, recipe_id, interaction_type: 'dislike' });

    if (deleteError) {
      console.error('Error deleting dislike:', deleteError.message);
      return res.status(500).json({ error: 'Error deleting dislike' });
    }

    const { data: recipe, error: fetchError } = await supabase
      .from('recipes')
      .select('dislikes')
      .eq('recipe_id', recipe_id)
      .single();

    if (fetchError) {
      console.error('Error fetching recipe:', fetchError.message);
      return res.status(500).json({ error: 'Error fetching recipe' });
    }

    const newDislikesCount = Math.max(0, recipe.dislikes - 1);

    const { error: updateError } = await supabase
      .from('recipes')
      .update({ dislikes: newDislikesCount })
      .eq('recipe_id', recipe_id);

    if (updateError) {
      console.error('Error updating dislikes:', updateError.message);
      return res.status(500).json({ error: 'Error updating dislikes' });
    }

    res.status(200).json({ message: 'Dislike deleted successfully' });
  } catch (error) {
    console.error('Error deleting dislike:', error.message);
    res.status(500).json({ error: 'Error deleting dislike' });
  }
});

app.get('/check-liked-recipe', authenticateToken, async (req, res) => {
  const { recipe_id } = req.query;
  const user_id = req.user.id;

  try {
    const { data, error } = await supabase
      .from('recipe_likes')
      .select()
      .eq('user_id', user_id)
      .eq('recipe_id', recipe_id)
      .eq('interaction_type', 'like');

    if (error) {
      console.error('Error checking liked recipe:', error.message);
      return res.status(500).json({ error: 'Error checking liked recipe' });
    }

    const liked = data && data.length > 0;
    res.status(200).json({ liked });
  } catch (error) {
    console.error('Error checking liked recipe:', error.message);
    res.status(500).json({ error: 'Error checking liked recipe' });
  }
});

app.get('/check-disliked-recipe', authenticateToken, async (req, res) => {
  const { recipe_id } = req.query;
  const user_id = req.user.id;

  try {
    const { data, error } = await supabase
      .from('recipe_likes')
      .select()
      .eq('user_id', user_id)
      .eq('recipe_id', recipe_id)
      .eq('interaction_type', 'dislike');

    if (error) {
      console.error('Error checking disliked recipe:', error.message);
      return res.status(500).json({ error: 'Error checking disliked recipe' });
    }

    const disliked = data && data.length > 0;
    res.status(200).json({ disliked });
  } catch (error) {
    console.error('Error checking disliked recipe:', error.message);
    res.status(500).json({ error: 'Error checking disliked recipe' });
  }
});

app.put('/recipes/:id', authenticateToken, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const { data: existingRecipe, error: fetchError } = await supabase
      .from('recipes')
      .select('*')
      .eq('recipe_id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingRecipe) {
      console.error('Error fetching recipe or recipe does not exist:', fetchError?.message);
      return res.status(404).json({ message: 'Recipe not found or access denied.', details: fetchError?.message });
    }

    const updates = buildUpdates(req);
    const { error: updateError } = await supabase
      .from('recipes')
      .update(updates)
      .eq('recipe_id', id);

    if (updateError) {
      console.error('Error updating recipe:', updateError.message);
      return res.status(500).json({ message: 'Error updating recipe', details: updateError.message });
    }

    const updatedRecipe = await retryFetchUpdatedRecipe(id, 3);

    if (!updatedRecipe) {
      console.error('Failed to fetch updated recipe after multiple attempts.');
      return res.status(500).json({ message: 'No data returned from server after update.' });
    }

    return res.json(updatedRecipe);
  } catch (err) {
    console.error('Server error during recipe update:', err.message);
    return res.status(500).json({ message: 'Server error during recipe update', details: err.message });
  }
});

async function retryFetchUpdatedRecipe(recipeId, attempts) {
  while (attempts-- > 0) {
    const { data: updatedRecipe, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('recipe_id', recipeId)
      .maybeSingle();

    if (updatedRecipe) {
      return updatedRecipe;
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return null;
}

function buildUpdates(req) {
  const updates = {};
  const fields = ['title', 'ingredients', 'instructions', 'movie_title', 'meal_type', 'dietary_restriction', 'movie_genre', 'description', 'prep_time'];
  fields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });
  if (req.file && req.body.field === 'image') {
    updates['image'] = req.file.path;
  }
  return updates;
}

app.delete('/recipes/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const { data: existingRecipe, error: fetchError } = await supabase
      .from('recipes')
      .select('*')
      .eq('recipe_id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingRecipe) {
      return res.status(404).json({ message: 'No recipe found or access denied for this user.', details: fetchError?.message });
    }

    const { data: deletedRecipe, error: deleteError } = await supabase
      .from('recipes')
      .delete()
      .eq('recipe_id', id)
      .select('*')
      .single();

    if (deleteError) {
      console.error('Error deleting recipe:', deleteError.message);
      return res.status(500).json({ message: 'Error deleting the recipe', details: deleteError.message });
    }

    const imageUrl = deletedRecipe.image;
    if (imageUrl) {
      const publicId = imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId)
        .catch(err => console.error('Error deleting image from Cloudinary:', err));
    } else {
      console.log('Recipe has no image to delete.');
    }

    await cloudinary.api.delete_resources_by_prefix('holding/');

    return res.status(200).json({ message: 'Recipe deleted successfully', recipe: deletedRecipe });
  } catch (err) {
    console.error('Server error during recipe deletion:', err.message);
    return res.status(500).json({ message: 'Server error during recipe deletion', details: err.message });
  }
});

app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);

app.get('/api/movies/search', movieController.searchMoviesByName);

app.listen(port, () => {
  // need to update later
  console.log(`Server is running on http://localhost:${port}`);
});