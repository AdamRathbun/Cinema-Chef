import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './YourRecipes.scss';
import defaultImage from '../../assets/default.png';

const YourRecipes = () => {
  const [userRecipes, setUserRecipes] = useState([]);
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        // need to update later with hosting
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
    <div className='overall'>
      <h2>Your Recipes</h2>
      {authToken ? (
        <div className='grid'>
          {userRecipes.map((recipe) => (
            <div className='grid-unit' key={recipe.recipe_id}>
              <Link to={`/recipes/${recipe.recipe_id}`}>
                <h3>{recipe.title}</h3>
                {recipe.image ? (
                  <img src={recipe.image} alt={recipe.title} />
                ) : (
                  <img id='image--default' src={defaultImage} alt='No recipe image.' />
                )
                }
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>Please log in to view your recipes.</p>
      )}
    </div>
  );
};

export default YourRecipes;
