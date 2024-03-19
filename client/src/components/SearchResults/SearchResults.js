import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const { searchType, searchTerm } = useParams();
  const authToken = localStorage.getItem('authToken');

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

  return (
    <div>
      <h2>Search Results</h2>
      {searchResults.length === 0 ? (
        <h3>No recipes matching that search</h3>
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

export default SearchResults;
