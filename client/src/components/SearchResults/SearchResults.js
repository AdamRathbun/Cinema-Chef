import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './SearchResults.scss';
import defaultImage from '../../assets/default.png';

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { searchType, searchTerm } = useParams();
  const authToken = localStorage.getItem('authToken');
  const recipesPerPage = 9;

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        let endpoint;
        switch (searchType) {
          case 'meal-type':
            endpoint = `/recipes/meal-type/${searchTerm}`;
            break;
          case 'dietary-restriction':
            endpoint = `/recipes/dietary-restriction/${searchTerm}`;
            break;
          case 'movie-genre':
            endpoint = `/recipes/movie-genre/${searchTerm}`;
            break;
          case 'recipe-name':
            endpoint = `/recipes/recipe-name/${searchTerm}`;
            break;
          default:
            console.error('Invalid search type:', searchType);
            return;
        }
        const response = await axios.get(`http://localhost:5000${endpoint}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error(`Error fetching search results for ${searchType}:`, error);
      }
    };

    fetchSearchResults();
  }, [authToken, searchType, searchTerm]);

  const totalPages = Math.ceil(searchResults.length / recipesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = searchResults.slice(indexOfFirstRecipe, indexOfLastRecipe);

  function truncateTitle(text) {
    const max = 66
    if (text.length > max) {
      return text.substring(0, max) + '...'
    }
    return text
  }

  return (
    <div className='overall'>
      <h2>Search Results</h2>
      {searchResults.length === 0 ? (
        <h3>No recipes matching that search.</h3>
      ) : (
        <div>
          <div className='grid'>
            {currentRecipes.map((recipe) => (
              <div className='grid-unit--large' key={recipe.recipe_id}>
                <Link to={`/recipes/${recipe.recipe_id}`}>
                  <h3>{truncateTitle(recipe.title)}</h3>
                  {recipe.image ? (
                    <img src={recipe.image} alt={recipe.title} />
                  ) : (
                    <img id='image--default' src={defaultImage} />
                  )}
                  <p>Meal Type: {recipe.meal_type}</p>
                  {recipe.dietary_restriction === 'gluten_free' ? (
                    <p>Dietary Restriction: gluten free</p>
                  ) : (
                    <p>Dietary Restriction: {recipe.dietary_restriction}</p>
                  )}
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
      )}
    </div>
  );
};

export default SearchResults;
