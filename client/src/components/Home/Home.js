import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import SearchTag from '../SearchTag/SearchTag';
import './Home.scss'

function Home() {
  const [likedRecipes, setLikedRecipes] = useState([]);
  const navigate = useNavigate();

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'dessert', 'drink'];
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

  function truncate(text) {
    const max = 150
    if (text.length > max) {
      return text.substring(0, max) + '...'
    }
  }

  const likedRecipesWithImages = likedRecipes.filter(recipe => recipe.image);
  const likedRecipesWithoutImages = likedRecipes.filter(recipe => !recipe.image);

  console.log(likedRecipes)

  return (
    <div className='home'>
      <h1>Explore culinary recipes based on cinematic masterpieces</h1>

      <div className='showcase-section'>
        <div className="headline-section">
          <h2>Our Favorite Recipe</h2>
          {likedRecipes.length > 0 && (
            <div className="headline-recipe">
              <Link to={`/recipes/${likedRecipes[0].recipe_id}`}>
                <div className='image--headline'>
                  {likedRecipes[0].image &&
                    <img src={likedRecipes[0].image} alt={likedRecipes[0].title}
                    />}
                </div>
                <h3>{likedRecipes[0].title}</h3>
                <p>{truncate(likedRecipes[0].description)}</p>
              </Link>
            </div>
          )}
        </div>
        <div className="highlighted-section">
          <div className="highlighted-recipes">
            <h2>Hot Recipes</h2>
            {likedRecipes.slice(1, 4).map((recipe) => (
              <div key={recipe.recipe_id} className="highlighted-recipe">
                <Link to={`/recipes/${recipe.recipe_id}`}>
                  <div className='highlighted-recipe__content'>
                    {recipe.image &&
                      <img className='image' src={recipe.image} alt={recipe.title}
                      />}
                    <h3>{recipe.title}</h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='search-section'>
        <div className='tag-section'>
          <h4>Search by category</h4>
          <SearchTag tags={mealTypes} onSearch={(tag) => handleSearch(tag, 'meal-type')} />
        </div>
        <div className='tag-section'>
          <h4>Search by dietary restriction</h4>
          <SearchTag tags={dietaryRestrictions} onSearch={(tag) => handleSearch(tag, 'dietary-restriction')} />
        </div>
        <div className='tag-section'>
          <h4>Search by movie genre</h4>
          <SearchTag tags={movieGenres} onSearch={(tag) => handleSearch(tag, 'movie-genre')} />
        </div>
      </div>

      <div className='band'>
        <h5>Oven-Hot Desserts to Warm Up Your Day</h5>
      </div>

      <div className='grid'>
        {likedRecipesWithImages
          .filter(recipe => recipe.meal_type === 'dessert')
          .slice(0, 6)
          .map((recipe) => (
            <div className='grid-unit' key={recipe.recipe_id}>
              <Link to={`/recipes/${recipe.recipe_id}`}>
                <img className='image' src={recipe.image} alt={recipe.title} />
                <h3>{recipe.title}</h3>
                <p>Likes: {recipe.likes}</p>
              </Link>
            </div>
          ))}
      </div>

      <div className='band drink'>
        <h5>Sensational Sippers for Every Occassion</h5>
      </div>

      <div className='grid'>
        {likedRecipesWithImages
          .filter(recipe => recipe.meal_type === 'drink')
          .slice(0, 6)
          .map((recipe) => (
            <div className='grid-unit' key={recipe.recipe_id}>
              <Link to={`/recipes/${recipe.recipe_id}`}>
                <img className='image' src={recipe.image} alt={recipe.title} />
                <h3>{recipe.title}</h3>
                <p>Likes: {recipe.likes}</p>
              </Link>
            </div>
          ))}
      </div>

    </div>
  );
}

export default Home;
