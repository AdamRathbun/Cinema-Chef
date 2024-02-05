import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [likedRecipes, setLikedRecipes] = useState([]);

  useEffect(() => {
    // *Update link once hosted
    axios.get('http://localhost:5000/top-liked-recipes')
      .then((response) => {
        console.log('Response data:', response.data);
        setLikedRecipes(response.data);
      })
      .catch((error) => {
        console.error('Error fetching top liked recipes:', error);
      });
  }, []);

  return (
    <div>
      <h1>Cinema Chef</h1>
      <p>Explore culinary recipes based on cinematic masterpieces</p>

      <h2>Most Liked Recipes</h2>
      <ul>
        {likedRecipes.map((recipe) => (
          <li key={recipe.recipe_id}>
            <h3>{recipe.title}</h3>
            <p>{recipe.ingredients}</p>
            <p>{recipe.instructions}</p>
            <p>Likes: {recipe.likes}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
