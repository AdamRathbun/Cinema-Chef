import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

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
    <div>
      <h2>Search Results</h2>
      {searchResults.length === 0 ? (
        <h3>No recipes matching that search.</h3>
      ) : (
        <ul>
          {searchResults.map((recipe) => (
            <li key={recipe.recipe_id}>
              <Link to={`/recipes/${recipe.recipe_id}`}>
                <h3>{recipe.title}</h3>
                <p>{recipe.movie_title}</p>
                {recipe.image && <img src={recipe.image} alt={recipe.title} />}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBarResults;
