const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const authenticateToken = require('../middleware/authMiddleware');
router.get('/recipes', recipeController.getAllRecipes);
router.get('/recipes/:id', recipeController.getRecipeById);
router.get('/user-recipes', authenticateToken, recipeController.getUserRecipes);
router.get('/recipes/search/meal-type/:mealType', recipeController.searchByMealType);
router.get('/recipes/search/dietary-restriction/:dietaryRestriction', recipeController.searchByDietaryRestriction);
router.get('/recipes/search/movie-genre/:movieGenre', recipeController.searchByMovieGenre);
router.get('/recipes/search/recipe-name/:searchTerm', recipeController.searchRecipes);
router.post('/recipes-with-image', authenticateToken, recipeController.addRecipeWithImage);
router.post('/recipes-without-image', authenticateToken, recipeController.addRecipeWithoutImage);
router.post('/upload-image', authenticateToken, recipeController.uploadImage);
router.put('/recipes/:id', authenticateToken, recipeController.updateRecipe);
router.delete('/recipes/:id', authenticateToken, recipeController.deleteRecipe);

router.post('/save', authenticateToken, recipeController.saveRecipe);
router.delete('/unsave', authenticateToken, recipeController.unsaveRecipe);
router.get('/saved-recipes', authenticateToken, recipeController.getSavedRecipes);
router.get('/check-saved-recipe', authenticateToken, recipeController.checkSavedRecipe);

module.exports = router;