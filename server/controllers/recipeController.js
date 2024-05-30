const { createClient } = require('@supabase/supabase-js');
// const config = require('../config');

// const supabase = createClient(config.supabaseURL, config.supabaseKey);
const supabase = createClient(process.env.supabaseURL, process.env.supabaseKey);

const getAllRecipes = async (req, res) => {
  try {
    const { data: recipes, error } = await supabase.from('recipes').select('*');

    if (error) {
      console.error(error);
      return res.status(500).send('Error fetching recipes');
    }

    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching recipes');
  }
};

const getRecipeById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data: recipe, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('recipe_id', id)
      .single();

    if (error) {
      console.error(error);
      return res.status(500).send('Error fetching recipe by ID');
    }

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching recipe by ID');
  }
};

const getUserRecipes = async (req, res) => {
  const userId = req.user.id;

  try {
    const { data: userRecipes, error } = await supabase.from('recipes').select('*').eq('user_id', userId);

    if (error) {
      console.error(error);
      return res.status(500).send('Error fetching user-specific recipes');
    }

    res.json(userRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching user-specific recipes');
  }
};

const searchByMealType = async (req, res) => {
  const { mealType } = req.params;

  try {
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('meal_type', mealType);

    if (error) {
      console.error('Error searching recipes by meal type:', error);
      return res.status(500).json({ error: 'An error occurred while searching recipes by meal type' });
    }

    res.json(recipes);
  } catch (error) {
    console.error('Error searching recipes by meal type:', error);
    res.status(500).json({ error: 'An error occurred while searching recipes by meal type' });
  }
};

const searchByDietaryRestriction = async (req, res) => {
  const { dietaryRestriction } = req.params;

  try {
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('dietary_restriction', dietaryRestriction);

    if (error) {
      console.error('Error searching recipes by dietary restriction:', error);
      return res.status(500).json({ error: 'An error occurred while searching recipes by dietary restriction' });
    }

    res.json(recipes);
  } catch (error) {
    console.error('Error searching recipes by dietary restriction:', error);
    res.status(500).json({ error: 'An error occurred while searching recipes by dietary restriction' });
  }
};

const searchByMovieGenre = async (req, res) => {
  const { movieGenre } = req.params;

  try {
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('movie_genre', movieGenre);

    if (error) {
      console.error('Error searching recipes by movie genre:', error);
      return res.status(500).json({ error: 'An error occurred while searching recipes by movie genre' });
    }

    res.json(recipes);
  } catch (error) {
    console.error('Error searching recipes by movie genre:', error);
    res.status(500).json({ error: 'An error occurred while searching recipes by movie genre' });
  }
};

const searchRecipes = async (req, res) => {
  const { searchTerm } = req.params;

  try {
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .ilike('title', `%${searchTerm.toLowerCase()}%`);

    if (error) {
      console.error('Error searching recipes:', error);
      return res.status(500).json({ error: 'An error occurred while searching recipes' });
    }

    res.json(recipes);
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({ error: 'An error occurred while searching recipes' });
  }
};

const addRecipeWithoutImage = async (req, res) => {
  const { title, ingredients, instructions, movie_title } = req.body;

  try {
    const { data: newRecipe, error } = await supabase
      .from('recipes')
      .insert([{ title, ingredients, instructions, movie_title }]);

    if (error) {
      console.error(error);
      return res.status(500).send('Error creating a new recipe without image');
    }

    res.status(201).json(newRecipe[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating a new recipe without image');
  }
};

const addRecipeWithImage = async (req, res) => {
  const { title, ingredients, instructions, movie_title, imageUrl } = req.body;

  try {
    const { data: newRecipe, error } = await supabase
      .from('recipes')
      .insert([{ title, ingredients, instructions, movie_title, image: imageUrl }]);

    if (error) {
      console.error(error);
      return res.status(500).send('Error creating a new recipe with image');
    }

    res.status(201).json(newRecipe[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating a new recipe with image');
  }
};

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded.' });
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    const imageUrl = result.secure_url;

    const recipe_id = req.body.recipe_id;

    // Update the recipe in Supabase with the image URL
    const { data: updatedRecipe, error: updateError } = await supabase
      .from('recipes')
      .update({ image: imageUrl })
      .eq('recipe_id', recipe_id)
      .single();

    if (updateError) {
      console.error('Error updating recipe with new image:', updateError.message);
      return res.status(500).send('Error updating recipe with new image');
    }

    res.json({ image: imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateRecipe = async (req, res) => {
  const { id } = req.params;
  const { field, value } = req.body;

  try {
    if (req.file && field === 'image') {
      const result = await cloudinary.uploader.upload(req.file.path);
      const newImageUrl = result.secure_url;

      const existingRecipeResult = await supabase
        .from('recipes')
        .select('image')
        .eq('recipe_id', id)
        .single();
      const existingRecipe = existingRecipeResult.data;
      if (existingRecipe.image) {
        const publicId = existingRecipe.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      const { data: updatedRecipe, error: updateError } = await supabase
        .from('recipes')
        .update({ image: newImageUrl })
        .eq('recipe_id', id)
        .single();

      if (updateError) {
        console.error('Error updating recipe with new image:', updateError.message);
        return res.status(500).send('Error updating recipe with new image');
      }

      return res.json(updatedRecipe);
    }

    const { data: updatedRecipe, error: updateError } = await supabase
      .from('recipes')
      .update({ [field]: value })
      .eq('recipe_id', id)
      .single();

    if (updateError) {
      console.error('Error updating recipe:', updateError.message);
      return res.status(500).send('Error updating recipe');
    }

    res.json(updatedRecipe);
  } catch (err) {
    console.error('Error updating the recipe:', err.message);
    res.status(500).send('Error updating the recipe');
  }
};

const deleteRecipe = async (req, res) => {
  const { id } = req.params;
  try {
    const { data: deletedRecipe, error: deleteError } = await supabase
      .from('recipes')
      .delete()
      .eq('recipe_id', id)
      .single();

    if (deleteError) {
      console.error('Error deleting the recipe:', deleteError.message);
      return res.status(500).send('Error deleting the recipe');
    }

    res.json(deletedRecipe);
  } catch (err) {
    console.error('Error deleting the recipe:', err.message);
    res.status(500).send('Error deleting the recipe');
  }
};

const saveRecipe = async (req, res) => {
  const userId = req.user.id;
  const { recipeId } = req.body;

  try {
    const { data: existingSavedRecipe, error: savedRecipeError } = await supabase
      .from('saved_recipes')
      .select()
      .eq('user_id', userId)
      .eq('recipe_id', recipeId)
      .single();

    if (existingSavedRecipe) {
      return res.status(400).send('Recipe already saved by the user');
    }

    const { error: insertError } = await supabase
      .from('saved_recipes')
      .insert([{ user_id: userId, recipe_id: recipeId }]);

    if (insertError) {
      console.error('Error saving recipe:', insertError.message);
      return res.status(500).send('Error saving recipe');
    }

    res.status(201).send('Recipe saved successfully');
  } catch (err) {
    console.error('Error saving recipe:', err.message);
    res.status(500).send('Error saving recipe');
  }
};

const unsaveRecipe = async (req, res) => {
  const userId = req.user.id;
  const { recipeId } = req.body;

  try {
    const { error: deleteError } = await supabase
      .from('saved_recipes')
      .delete()
      .eq('user_id', userId)
      .eq('recipe_id', recipeId);

    if (deleteError) {
      console.error('Error unsaving recipe:', deleteError.message);
      return res.status(500).send('Error unsaving recipe');
    }

    res.status(200).send('Recipe unsaved successfully');
  } catch (err) {
    console.error('Error unsaving recipe:', err.message);
    res.status(500).send('Error unsaving recipe');
  }
};

const getSavedRecipes = async (req, res) => {
  const userId = req.user.id;

  try {
    const { data: savedRecipes, error: fetchError } = await supabase
      .from('recipes')
      .select()
      .eq('user_id', userId)
      .join('saved_recipes', { type: 'inner', 'recipes.recipe_id': 'saved_recipes.recipe_id' });

    if (fetchError) {
      console.error('Error fetching saved recipes:', fetchError.message);
      return res.status(500).json({ error: 'An error occurred while fetching saved recipes' });
    }

    res.json(savedRecipes);
  } catch (err) {
    console.error('Error fetching saved recipes:', err.message);
    res.status(500).json({ error: 'An error occurred while fetching saved recipes' });
  }
};
const checkSavedRecipe = async (req, res) => {
  const { user_id, recipe_id } = req.query;

  try {
    const { data: savedRecipes, error: fetchError } = await supabase
      .from('saved_recipes')
      .select()
      .eq('user_id', user_id)
      .eq('recipe_id', recipe_id);

    if (fetchError) {
      console.error('Error checking saved recipe:', fetchError.message);
      return res.status(500).json({ error: 'Error checking saved recipe' });
    }

    res.status(200).json({ saved: savedRecipes.length > 0 });
  } catch (error) {
    console.error('Error checking saved recipe:', error.message);
    res.status(500).json({ error: 'Error checking saved recipe' });
  }
};

const likeRecipe = async (req, res) => {
  const { user_id, recipe_id } = req.body;

  try {
    const { data: existingLike, error: fetchError } = await supabase
      .from('recipe_likes')
      .select()
      .eq('user_id', user_id)
      .eq('recipe_id', recipe_id)
      .eq('interaction_type', 'like');

    if (fetchError) {
      console.error('Error liking recipe:', fetchError.message);
      return res.status(500).json({ error: 'Error liking recipe' });
    }

    if (existingLike.length > 0) {
      return res.status(400).json({ error: 'User has already liked this recipe' });
    }

    await supabase.from('recipe_likes').insert([{ user_id, recipe_id, interaction_type: 'like' }]);
    await supabase.from('recipes').update({ likes: supabase.raw('likes + 1') }).eq('recipe_id', recipe_id);

    res.status(200).json({ message: 'Recipe liked successfully' });
  } catch (error) {
    console.error('Error liking recipe:', error.message);
    res.status(500).json({ error: 'Error liking recipe' });
  }
};

const dislikeRecipe = async (req, res) => {
  const { user_id, recipe_id } = req.body;

  try {
    const { data: existingDislike, error: fetchError } = await supabase
      .from('recipe_likes')
      .select()
      .eq('user_id', user_id)
      .eq('recipe_id', recipe_id)
      .eq('interaction_type', 'dislike');

    if (fetchError) {
      console.error('Error disliking recipe:', fetchError.message);
      return res.status(500).json({ error: 'Error disliking recipe' });
    }

    if (existingDislike.length > 0) {
      return res.status(400).json({ error: 'User has already disliked this recipe' });
    }

    await supabase.from('recipe_likes').insert([{ user_id, recipe_id, interaction_type: 'dislike' }]);
    await supabase.from('recipes').update({ dislikes: supabase.raw('dislikes + 1') }).eq('recipe_id', recipe_id);

    res.status(200).json({ message: 'Recipe disliked successfully' });
  } catch (error) {
    console.error('Error disliking recipe:', error.message);
    res.status(500).json({ error: 'Error disliking recipe' });
  }
};

const deleteLike = async (req, res) => {
  const { user_id, recipe_id } = req.body;

  try {
    await supabase
      .from('recipe_likes')
      .delete()
      .eq('user_id', user_id)
      .eq('recipe_id', recipe_id)
      .eq('interaction_type', 'like');

    await supabase.from('recipes').update({ likes: supabase.raw('CASE WHEN likes > 0 THEN likes - 1 ELSE 0 END') }).eq('recipe_id', recipe_id);

    res.status(200).json({ message: 'Like deleted successfully' });
  } catch (error) {
    console.error('Error deleting like:', error.message);
    res.status(500).json({ error: 'Error deleting like' });
  }
};

const deleteDislike = async (req, res) => {
  const { user_id, recipe_id } = req.body;

  try {
    await supabase
      .from('recipe_likes')
      .delete()
      .eq('user_id', user_id)
      .eq('recipe_id', recipe_id)
      .eq('interaction_type', 'dislike');

    await supabase.from('recipes').update({ dislikes: supabase.raw('dislikes - 1') }).eq('recipe_id', recipe_id);

    res.status(200).json({ message: 'Dislike deleted successfully' });
  } catch (error) {
    console.error('Error deleting dislike:', error.message);
    res.status(500).json({ error: 'Error deleting dislike' });
  }
};

const checkLikedRecipe = async (req, res) => {
  const { user_id, recipe_id } = req.query;

  try {
    const { data: likedRecipe, error } = await supabase
      .from('recipe_likes')
      .select('*')
      .eq('user_id', user_id)
      .eq('recipe_id', recipe_id)
      .eq('interaction_type', 'like')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json({ liked: !!likedRecipe });
  } catch (error) {
    console.error('Error checking liked recipe:', error);
    res.status(500).json({ error: 'Error checking liked recipe' });
  }
};

const checkDislikedRecipe = async (req, res) => {
  const { user_id, recipe_id } = req.query;

  try {
    const { data: dislikedRecipe, error } = await supabase
      .from('recipe_likes')
      .select('*')
      .eq('user_id', user_id)
      .eq('recipe_id', recipe_id)
      .eq('interaction_type', 'dislike')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json({ disliked: !!dislikedRecipe });
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

