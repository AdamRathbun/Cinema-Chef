import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import DeleteRecipe from '../DeleteRecipe/DeleteRecipe';
import UpdateRecipe from '../UpdateRecipe/UpdateRecipe';
import SaveRecipe from '../SaveRecipe/SaveRecipe';
import UnsaveRecipe from '../SaveRecipe/UnsaveRecipe';
import LikeRecipe from '../LikeRecipe/LikeRecipe';
import DislikeRecipe from '../LikeRecipe/DislikeRecipe';
import { FacebookShareButton, TwitterShareButton, PinterestShareButton } from 'react-share';
import { jwtDecode } from 'jwt-decode';

function Recipe() {
  const [recipe, setRecipe] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [movieInfo, setMovieInfo] = useState(null);
  const [showMovieInfo, setShowMovieInfo] = useState(false);
  const [user, setUser] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const authToken = localStorage.getItem('authToken');
  const recipeUrl = `http://localhost:5000/recipes/${id}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // *need to update later with hosting
        const response = await axios.get(`http://localhost:5000/recipes/${id}`);

        setRecipe(response.data);

        const movieTitle = response.data.movie_title;
        if (movieTitle) {
          // *need to update later with hosting
          const movieResponse = await axios.get(`http://localhost:5000/api/movies/search?name=${movieTitle}`);
          const movieData = movieResponse.data[0];

          if (movieData && movieData.title.toLowerCase() === movieTitle.toLowerCase()) {
            setMovieInfo(movieData);
          } else {
            setMovieInfo(null);
          }
        }
      } catch (error) {
        console.error('Error fetching recipe or movie information:', error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');

    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        setUser(decodedToken.userId);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  useEffect(() => {
    const checkSavedRecipe = async () => {
      try {
        // *need to update later with hosting
        const response = await axios.get(`http://localhost:5000/check-saved-recipe?user_id=${user}&recipe_id=${id}`, {
          user_id: user,
          recipe_id: id,
        }, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        setIsSaved(response.data.saved);
      } catch (error) {
        console.error('Error checking saved recipe:', error);
      }
    };

    if (user) {
      checkSavedRecipe();
    }
  }, [user, id, authToken]);

  const handleDelete = async () => {
    try {
      if (!authToken) {
        console.error('Authentication token is missing.');
        return;
      }

      // *need to update later with hosting
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

      // *need to update later with hosting
      const response = await axios.put(`http://localhost:5000/recipes/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setRecipe(response.data);
    } catch (error) {
      console.error(`Error updating ${field}:`, error.response?.data || error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRecipeUpdate = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/recipes/${id}`);
      setRecipe(response.data);
    } catch (error) {
      console.error('Error fetching updated recipe data:', error);
    }
  };

  const toggleMovieInfo = () => {
    setShowMovieInfo(!showMovieInfo);
  };

  const isUserOwner = user && recipe && user === recipe.user_id;
  const isAuthenticated = authToken !== null;

  return (
    <div className="recipe">
      {recipe && (
        <>
          <h2 className="recipe_title">
            {recipe.title}
            {isUserOwner && (
              <UpdateRecipe
                field="title"
                initialValue={recipe.title}
                id={id}
                onUpdate={handleUpdate}
                authToken={authToken}
              />
            )}
          </h2>
          <button onClick={toggleMovieInfo}>
            {showMovieInfo ? 'Hide Movie Info' : 'Show Movie Info'}
          </button>
          <div className="recipe_movie_title">
            <strong>Description:</strong> {recipe.description}
            {isUserOwner && (
              <UpdateRecipe
                field="description"
                initialValue={recipe.description}
                id={id}
                onUpdate={handleUpdate}
                authToken={authToken}
              />
            )}
          </div>
          <div className="recipe_movie_title">
            <strong>Movie Title:</strong> {recipe.movie_title}
            {isUserOwner && (
              <UpdateRecipe
                field="movie_title"
                initialValue={recipe.movie_title}
                id={id}
                onUpdate={handleUpdate}
                authToken={authToken}
              />
            )}
          </div>
          <div>
            {recipe.image && <img className="recipe_image" src={recipe.image} alt={recipe.title} />}
            {movieInfo && showMovieInfo && movieInfo.poster_path && (
              <img
                className="recipe_movie_poster"
                src={`https://image.tmdb.org/t/p/w500${movieInfo.poster_path}`}
                alt={movieInfo.title}
              />
            )}
            {isUserOwner && (
              <UpdateRecipe field="image" initialValue={recipe.image} id={id} onUpdate={handleUpdate} authToken={authToken} />
            )}
          </div>
          <div className="recipe_ingredients">
            <strong>Ingredients:</strong> {recipe.ingredients}
            {isUserOwner && (
              <UpdateRecipe
                field="ingredients"
                initialValue={recipe.ingredients}
                id={id}
                onUpdate={handleUpdate}
                authToken={authToken}
              />
            )}
          </div>
          <div className="recipe_instructions">
            <strong>Instructions:</strong> {recipe.instructions}
            {isUserOwner && (
              <UpdateRecipe
                field="instructions"
                initialValue={recipe.instructions}
                id={id}
                onUpdate={handleUpdate}
                authToken={authToken}
              />
            )}
          </div>
          <div className="recipe_meal_type">
            <strong>Meal Type:</strong> {recipe.meal_type}
            {isUserOwner && (
              <UpdateRecipe
                field="meal_type"
                initialValue={recipe.meal_type}
                id={id}
                onUpdate={handleUpdate}
                authToken={authToken}
              />
            )}
          </div>
          <div className="recipe_dietary_restriction">
            <strong>Dietary Restriction:</strong> {recipe.dietary_restriction}
            {isUserOwner && (
              <UpdateRecipe
                field="dietary_restriction"
                initialValue={recipe.dietary_restriction}
                id={id}
                onUpdate={handleUpdate}
                authToken={authToken}
              />
            )}
          </div>
          <div className="recipe_movie_genre">
            <strong>Movie Genre:</strong>{" "}
            {recipe.movie_genre === "sci_fi" ? "sci-fi" : recipe.movie_genre}
            {isUserOwner && (
              <UpdateRecipe
                field="movie_genre"
                initialValue={recipe.movie_genre}
                id={id}
                onUpdate={handleUpdate}
                authToken={authToken}
              />
            )}
          </div>
          {isAuthenticated && !isUserOwner && (
            <>
              {isSaved ? (
                <UnsaveRecipe recipeId={id} userId={user} authToken={authToken} />
              ) : (
                <SaveRecipe recipeId={id} userId={user} authToken={authToken} />
              )}
            </>
          )}
          {!isAuthenticated && (
            <div>
              Please sign in to save this recipe.
            </div>
          )}
          {isUserOwner && (
            <DeleteRecipe recipeId={id} onDelete={handleDelete} authToken={authToken} />
          )}
          <div className="recipe_likes_and_dislikes">
            <div className="likes_container">
              <strong>Likes:</strong>
              {recipe.likes}
              {isAuthenticated && !isUserOwner && (
                <LikeRecipe recipeId={id} userId={user} authToken={authToken} onLike={handleRecipeUpdate} />
              )}
            </div>
            <div className="dislikes_container">
              <strong>Dislikes:</strong>
              {recipe.dislikes}
              {isAuthenticated && !isUserOwner && (
                <DislikeRecipe recipeId={id} userId={user} authToken={authToken} onLike={handleRecipeUpdate} />
              )}
            </div>
          </div>
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
      {recipe && (
        <>
          <FacebookShareButton url={recipeUrl} quote={recipe.title}>
            Share on Facebook
          </FacebookShareButton>
          <TwitterShareButton url={recipeUrl} title={recipe.title}>
            Share on Twitter/X
          </TwitterShareButton>
          <PinterestShareButton url={recipeUrl} description={recipe.title}>
            Share on Pinterest
          </PinterestShareButton>
        </>
      )}
    </div>
  );
}

export default Recipe;
