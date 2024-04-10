import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './YourRecipes.scss';
import defaultImage from '../../assets/default.png';

const YourRecipes = () => {
  const [userRecipes, setUserRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const authToken = localStorage.getItem('authToken');
  const recipesPerPage = 9;

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

  const totalPages = Math.ceil(userRecipes.length / recipesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = userRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  function truncateTitle(text) {
    const max = 48
    if (text.length > max) {
      return text.substring(0, max) + '...'
    }
    return text
  }

  return (
    <div className='overall'>
      <h2>Your Recipes</h2>
      {authToken ? (
        <div>
          <div className='grid'>
            {currentRecipes.map((recipe) => (
              <div className='grid-unit' key={recipe.recipe_id}>
                <Link to={`/recipes/${recipe.recipe_id}`}>
                  <h3>{truncateTitle(recipe.title)}</h3>
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
          {totalPages > 1 && (
            <div className='pagination'>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`button--page ${currentPage === index + 1 ? 'active-page' : ''}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p>Please log in to view your recipes.</p>
      )}
    </div>
  );
};

export default YourRecipes;
