const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// Routes for handling CRUD operations on recipes
router.get('/recipes', recipeController.getAllRecipes);
router.get('/recipes/:id', recipeController.getRecipeById);
router.post('/recipes', recipeController.addRecipe);
router.put('/recipes/:id', recipeController.updateRecipe);
router.delete('/recipes/:id', recipeController.deleteRecipe);

module.exports = router;
