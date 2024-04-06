import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './SearchBarResults.scss';
import defaultImage from '../../assets/default.png';

const SearchBarResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const { searchTerm } = useParams();
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        // *need to update with hosting
        const response = await axios.get(`http://localhost:5000/recipes/search/recipe-name/${searchTerm}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error(`Error fetching search results for recipe-name:`, error);
      }
    };

    fetchSearchResults();
  }, [authToken, searchTerm]);

  return (
    <div className='overall'>
      <h2>Search Results</h2>
      {searchResults.length === 0 ? (
        <h3>No recipes matching that search.</h3>
      ) : (
        <div className='grid'>
          {searchResults.map((recipe) => (
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
      )}
    </div>
  );
};

export default SearchBarResults;
