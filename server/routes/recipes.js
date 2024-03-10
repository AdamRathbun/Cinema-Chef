const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/recipes', recipeController.getAllRecipes);
router.get('/recipes/:id', recipeController.getRecipeById);
router.get('/user-recipes', authenticateToken, recipeController.getUserRecipes);
router.post('/recipes-with-image', authenticateToken, recipeController.addRecipeWithImage);
router.post('/recipes-without-image', authenticateToken, recipeController.addRecipeWithoutImage);
router.post('/upload-image', authenticateToken, recipeController.uploadImage);
router.put('/recipes/:id', authenticateToken, recipeController.updateRecipe);
router.delete('/recipes/:id', authenticateToken, recipeController.deleteRecipe);

module.exports = router;