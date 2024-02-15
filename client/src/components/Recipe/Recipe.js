import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Recipe() {
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:5000/recipes/${id}`)
      .then((response) => {
        console.log('Recipe data:', response.data);
        setRecipe(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching recipe:', error);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  return (
    <div className='recipe'>
      <h2 className='recipe_title'>{recipe.title}</h2>
      <p className='recipe_movie_title'>
        <strong>Movie Title:</strong> {recipe.movie_title}
      </p>
      {recipe.image && <img className='recipe_image' src={recipe.image} alt={recipe.title} />}
      <p className='recipe_ingredients'>
        <strong>Ingredients:</strong> {recipe.ingredients}
      </p>
      <p className='recipe_instructions'>
        <strong>Instructions:</strong> {recipe.instructions}
      </p>
    </div>
  );
}

export default Recipe;
