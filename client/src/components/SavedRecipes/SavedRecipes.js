import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'

function SavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        // *need to update later with hosting
        const response = await axios.get('http://localhost:5000/saved-recipes', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setSavedRecipes(response.data);
      } catch (error) {
        console.error('Error fetching saved recipes:', error);
      }
    };

    if (authToken) {
      fetchSavedRecipes();
    }
  }, [authToken]);

  return (
    <div>
      <h2>Saved Recipes</h2>
      <ul>
        {savedRecipes.map((savedRecipe) => (
          <li key={savedRecipe.recipe_id}>
            <Link to={`/recipes/${savedRecipe.recipe_id}`}>
              <p>Title: {savedRecipe.title}</p>
              <p>Movie Title: {savedRecipe.movie_title}</p>
              <p>Meal Type: {savedRecipe.meal_type}</p>
              {savedRecipe.dietary_restriction !== 'none' && (
                <p>Dietary Restriction: {savedRecipe.dietary_restriction}</p>
              )}
              <p>Likes: {savedRecipe.likes}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SavedRecipes;