import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [likedRecipes, setLikedRecipes] = useState([]);

  useEffect(() => {
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
            <Link to={`/recipes/${recipe.recipe_id}`}>
              <h3>{recipe.title}</h3>
              <p>{recipe.movie_title}</p>
              <p>{recipe.ingredients}</p>
              <p>{recipe.instructions}</p>
              <p>Likes: {recipe.likes}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
