import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import DeleteRecipe from '../DeleteRecipe/DeleteRecipe';
import UpdateRecipe from '../UpdateRecipe/UpdateRecipe';

function Recipe() {
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [movieInfo, setMovieInfo] = useState(null);
  const [showMovieInfo, setShowMovieInfo] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const authToken = localStorage.getItem('authToken');

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/recipes/${id}`);
        console.log('Recipe data:', response.data);
        setRecipe(response.data);

        const movieTitle = response.data.movie_title;
        if (movieTitle) {
          const movieResponse = await axios.get(`http://localhost:5000/api/movies/search?name=${movieTitle}`);
          const movieData = movieResponse.data[0];

          if (movieData && movieData.title.toLowerCase() === movieTitle.toLowerCase()) {
            setMovieInfo(movieData);
          } else {
            setMovieInfo(null);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching recipe or movie information:', error);
        setIsLoading(false);
      }
    };

    fetchData();

  }, [id]);

  const handleDelete = async () => {
    try {
      if (!authToken) {
        console.error('Authentication token is missing.');
        return;
      }

      const response = await axios.delete(`http://localhost:5000/recipes/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.deletedRecipe) {
        console.log('Deleted Recipe:', response.data.deletedRecipe);
        navigate('/');
      } else {
        console.error('Failed to delete recipe:', response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        navigate('/');
      } else {
        console.error('Error deleting recipe:', error);
      }
    }
  };

  const handleUpdate = async (field, updatedValue) => {
    console.log('handleUpdate called');

    if (isUpdating) {
      console.log('Update already in progress. Ignoring.');
      return;
    }

    setIsUpdating(true);

    try {
      if (!authToken) {
        console.error('Authentication token is missing.');
        return;
      }

      if (!recipe) {
        console.error('Recipe data not available.');
        return;
      }

      const updateData = {
        field,
        value: updatedValue,
      };

      const response = await axios.put(`http://localhost:5000/recipes/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log(`Recipe ${field} updated:`, response.data);

      setRecipe(response.data);
    } catch (error) {
      console.error(`Error updating ${field}:`, error.response?.data || error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleMovieInfo = () => {
    setShowMovieInfo(!showMovieInfo);
  };

  return (
    <div className="recipe">
      {recipe && (
        <>
          <h2 className="recipe_title">{recipe.title}</h2>
          <button onClick={toggleMovieInfo}>
            {showMovieInfo ? 'Hide Movie Info' : 'Show Movie Info'}
          </button>
          <p className="recipe_movie_title">
            <strong>Movie Title:</strong> {recipe.movie_title}
          </p>
          {recipe.image && <img className="recipe_image" src={recipe.image} alt={recipe.title} />}
          {movieInfo && showMovieInfo && movieInfo.poster_path && (
            <img
              className="recipe_movie_poster"
              src={`https://image.tmdb.org/t/p/w500${movieInfo.poster_path}`}
              alt={movieInfo.title}
            />
          )}
          <p className="recipe_ingredients">
            <strong>Ingredients:</strong> {recipe.ingredients}
          </p>
          <p className="recipe_instructions">
            <strong>Instructions:</strong> {recipe.instructions}
          </p>
          <UpdateRecipe
            field="title"
            initialValue={recipe.title}
            id={id} onUpdate={handleUpdate}
            authToken={authToken} />
          <UpdateRecipe
            field="ingredients"
            initialValue={recipe.ingredients}
            id={id}
            onUpdate={handleUpdate}
            authToken={authToken}
          />
          <UpdateRecipe
            field="instructions"
            initialValue={recipe.instructions}
            id={id}
            onUpdate={handleUpdate}
            authToken={authToken}
          />
          <UpdateRecipe
            field="movie_title"
            initialValue={recipe.movie_title}
            id={id}
            onUpdate={handleUpdate}
            authToken={authToken}
          />
          <UpdateRecipe field="image" initialValue={recipe.image} id={id} onUpdate={handleUpdate} authToken={authToken} />
          <DeleteRecipe recipeId={id} onDelete={handleDelete} authToken={authToken} />
          {showMovieInfo && movieInfo && (
            <>
              <h4>More about this movie:</h4>
              <p>{movieInfo.overview}</p>
              <p>Released in {movieInfo.release_date}.</p>
            </>
          )}
        </>
      )}
      {!recipe && <div>Recipe not found</div>}
    </div>
  );
}

export default Recipe;
