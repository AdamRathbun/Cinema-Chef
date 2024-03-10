import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const YourRecipes = () => {
  const [userRecipes, setUserRecipes] = useState([]);
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user-recipes', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUserRecipes(response.data);
      } catch (error) {
        console.error('Error fetching user recipes:', error);
      }
    };

    if (authToken) {
      fetchUserRecipes();
    }
  }, [authToken]);

  return (
    <div>
      <h2>Your Recipes</h2>
      {authToken ? (
        <ul>
          {userRecipes.map((recipe) => (
            <li key={recipe.recipe_id}>
              <Link to={`/recipes/${recipe.recipe_id}`}>
                <h3>{recipe.title}</h3>
                <p>{recipe.movie_title}</p>
                {recipe.image && <img src={recipe.image} alt={recipe.title} />}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Please log in to view your recipes.</p>
      )}
    </div>
  );
};

export default YourRecipes;
