import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import SearchTag from '../SearchTag/SearchTag';
import './Home.scss';

function Home() {
  const [likedRecipes, setLikedRecipes] = useState([]);
  const navigate = useNavigate();

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'dessert', 'drink'];
  const dietaryRestrictions = ['vegan', 'vegetarian', 'gluten_free', 'none'];
  const movieGenres = ['action', 'comedy', 'drama', 'thriller', 'horror', 'sci-fi', 'fantasy', 'romance', 'animated', 'documentary'];

  useEffect(() => {
    // *need to update later with hosting
    axios.get('https://cinema-chef.onrender.com/top-liked-recipes')
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

      navigate(`/search/${searchType}/${modifiedTag}`)
    } catch (error) {
      console.error(`Error fetching recipes with ${searchType}:`, error);
    }
  };

  function truncate(text) {
    const max = 155
    if (text.length > max) {
      return text.substring(0, max) + '...'
    }
    return text
  }

  function truncateTitle(text) {
    const max = 38
    if (text.length > max) {
      return text.substring(0, max) + '...'
    }
    return text
  }

  function truncateTitleShort(text) {
    const max = 34
    if (text.length > max) {
      return text.substring(0, max) + '...'
    }
    return text
  }

  function truncateTitleLong(text) {
    const max = 56
    if (text.length > max) {
      return text.substring(0, max) + '...'
    }
    return text
  }

  const likedRecipesWithImages = likedRecipes.filter(recipe => recipe.image);

  return (
    <div className='home'>
      <h1>Explore culinary creations based on cinematic masterpieces</h1>

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
                <h3>{truncateTitleLong(likedRecipes[0].title)}</h3>
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
                    <h3>{truncateTitle(recipe.title)}</h3>
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
                <h3>{truncateTitleShort(recipe.title)}</h3>
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
                <h3 id='h3--short'>{truncateTitleShort(recipe.title)}</h3>
                <p>Likes: {recipe.likes}</p>
              </Link>
            </div>
          ))}
      </div>

      <div className='band dinner'>
        <h5>Winner Winner Simple Dinner</h5>
      </div>

      <div className='grid'>
        {likedRecipesWithImages
          .filter(recipe => recipe.meal_type === 'dinner')
          .slice(0, 6)
          .map((recipe) => (
            <div className='grid-unit' key={recipe.recipe_id}>
              <Link to={`/recipes/${recipe.recipe_id}`}>
                <img className='image' src={recipe.image} alt={recipe.title} />
                <h3 id='h3--short'>{truncateTitleShort(recipe.title)}</h3>
                <p>Likes: {recipe.likes}</p>
              </Link>
            </div>
          ))}
      </div>

    </div>
  );
}

export default Home;
