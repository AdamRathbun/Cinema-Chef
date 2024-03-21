import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import SearchTag from '../SearchTag/SearchTag';

function Home() {
  const [likedRecipes, setLikedRecipes] = useState([]);
  const navigate = useNavigate();

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'dessert'];
  const dietaryRestrictions = ['vegan', 'vegetarian', 'gluten_free', 'none'];
  const movieGenres = ['action', 'comedy', 'drama', 'thriller', 'horror', 'sci-fi', 'fantasy', 'romance', 'animated', 'documentary'];

  useEffect(() => {
    // *need to update later with hosting
    axios.get('http://localhost:5000/top-liked-recipes')
      .then((response) => {
        setLikedRecipes(response.data);
      })
      .catch((error) => {
        console.error('Error fetching top liked recipes:', error);
      });
  }, []);

  const handleSearch = async (tag, searchType) => {
    try {
      const modifiedTag = searchType === 'movie-genre' && tag === 'sci-fi' ? 'sci_fi' : tag;

      const response = await axios.get(`http://localhost:5000/recipes/${searchType}/${modifiedTag}`);
      console.log(`Recipes with ${searchType} ${modifiedTag}:`, response.data);
      navigate(`/search/${searchType}/${modifiedTag}`)
    } catch (error) {
      console.error(`Error fetching recipes with ${searchType}:`, error);
    }
  };

  return (
    <div>
      <h1>Cinema Chef</h1>
      <p>Explore culinary recipes based on cinematic masterpieces</p>

      <h4>Search by meal type:</h4>
      <SearchTag tags={mealTypes} onSearch={(tag) => handleSearch(tag, 'meal-type')} />
      <h4>Search by dietary restriction:</h4>
      <SearchTag tags={dietaryRestrictions} onSearch={(tag) => handleSearch(tag, 'dietary-restriction')} />
      <h4>Search by movie genre:</h4>
      <SearchTag tags={movieGenres} onSearch={(tag) => handleSearch(tag, 'movie-genre')} />

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
