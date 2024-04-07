import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import defaultImage from '../../assets/default.png';
import './SavedRecipes.scss';

function SavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const authToken = localStorage.getItem('authToken');
  const recipesPerPage = 9;

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

  const totalPages = Math.ceil(savedRecipes.length / recipesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = savedRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  return (
    <div className='overall'>
      <h2>Saved Recipes</h2>
      {authToken ? (
        <div>
          <div className='grid'>
            {currentRecipes.map((recipe) => (
              <div className='grid-unit--large' key={recipe.recipe_id}>
                <Link to={`/recipes/${recipe.recipe_id}`}>
                  <h3>{recipe.title}</h3>
                  {recipe.image ? (
                    <img src={recipe.image} alt={recipe.title} />
                  ) : (
                    <img id='image--default' src={defaultImage} alt='No recipe image.' />
                  )
                  }
                  <p>Meal Type: {recipe.meal_type}</p>
                  {recipe.dietary_restriction === 'gluten_free' ? (
                    <p>Dietary Restriction: gluten free</p>
                  ) : (
                    <p>Dietary Restriction: {recipe.dietary_restriction}</p>
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
        <p>Please log in to view your saved recipes.</p>
      )}
    </div>
  );
}

export default SavedRecipes;