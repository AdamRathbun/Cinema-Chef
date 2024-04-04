import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import DeleteRecipe from '../DeleteRecipe/DeleteRecipe';
import UpdateRecipe from '../UpdateRecipe/UpdateRecipe';
import SaveRecipe from '../SaveRecipe/SaveRecipe';
import UnsaveRecipe from '../SaveRecipe/UnsaveRecipe';
import LikeRecipe from '../LikeRecipe/LikeRecipe';
import DislikeRecipe from '../LikeRecipe/DislikeRecipe';
import Footer from '../Footer/Footer';
import { FacebookShareButton, TwitterShareButton, PinterestShareButton } from 'react-share';
import { jwtDecode } from 'jwt-decode';
import './Recipe.scss'
import facebookIcon from '../../assets/facebook.png'
import xIcon from '../../assets/twitter.png'
import pinterestIcon from '../../assets/pinterest.png'
import printerIcon from '../../assets/printer.png'

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
    <div className='recipe'>
      {recipe && (
        <>
          <h2 className='title'>
            {recipe.title}
            {isUserOwner && (
              <UpdateRecipe
                field='title'
                initialValue={recipe.title}
                id={id}
                onUpdate={handleUpdate}
                authToken={authToken}
              />
            )}
          </h2>
          <div className='top-container'>
            <div>
              {!isAuthenticated && (
                <div>
                  Sign in to save recipe
                </div>
              )}
              {isAuthenticated && !isUserOwner && (
                <>
                  {isSaved ? (
                    <UnsaveRecipe recipeId={id} userId={user} authToken={authToken} />
                  ) : (
                    <SaveRecipe recipeId={id} userId={user} authToken={authToken} />
                  )}
                </>
              )}
              {isUserOwner && (
                <DeleteRecipe recipeId={id} onDelete={handleDelete} authToken={authToken} />
              )}
            </div>
            <div className='likes-and-dislikes-container'>
              <div className='likes'>
                <strong>Likes:</strong>
                {recipe.likes}
                {isAuthenticated && !isUserOwner && (
                  <LikeRecipe recipeId={id} userId={user} authToken={authToken} onLike={handleRecipeUpdate} />
                )}
              </div>
              <div className='dislikes'>
                <strong>Dislikes:</strong>
                {recipe.dislikes}
                {isAuthenticated && !isUserOwner && (
                  <DislikeRecipe recipeId={id} userId={user} authToken={authToken} onLike={handleRecipeUpdate} />
                )}
              </div>
            </div>
            <div className='prep-time'>
              <strong>Time:</strong> {recipe.prep_time}
              {isUserOwner && (
                <UpdateRecipe
                  field='prep_time'
                  initialValue={recipe.prep_time}
                  id={id}
                  onUpdate={handleUpdate}
                  authToken={authToken}
                />
              )}
            </div>
          </div>
          <div className='description'>
            <strong>Description:</strong> {recipe.description}
            {isUserOwner && (
              <UpdateRecipe
                field='description'
                initialValue={recipe.description}
                id={id}
                onUpdate={handleUpdate}
                authToken={authToken}
              />
            )}
          </div>
          <div className='image-container'>
            {recipe.image && <img className='image' src={recipe.image} alt={recipe.title} />}
            {isUserOwner && (
              <UpdateRecipe field='image' initialValue={recipe.image} id={id} onUpdate={handleUpdate} authToken={authToken} />
            )}
          </div>
          <div className='ingredients'>
            <strong>Ingredients:</strong> {recipe.ingredients}
            {isUserOwner && (
              <UpdateRecipe
                field='ingredients'
                initialValue={recipe.ingredients}
                id={id}
                onUpdate={handleUpdate}
                authToken={authToken}
              />
            )}
          </div>
          <div className='instructions'>
            <strong>Instructions:</strong> {recipe.instructions}
            {isUserOwner && (
              <UpdateRecipe
                field='instructions'
                initialValue={recipe.instructions}
                id={id}
                onUpdate={handleUpdate}
                authToken={authToken}
              />
            )}
          </div>
          <div className='meal-container'>
            <div className='meal-type'>
              <strong>Category:</strong> {recipe.meal_type}
              {isUserOwner && (
                <UpdateRecipe
                  field='meal_type'
                  initialValue={recipe.meal_type}
                  id={id}
                  onUpdate={handleUpdate}
                  authToken={authToken}
                />
              )}
            </div>
            <div className='dietary-restriction'>
              <strong>Dietary Restriction:</strong> {recipe.dietary_restriction}
              {isUserOwner && (
                <UpdateRecipe
                  field='dietary_restriction'
                  initialValue={recipe.dietary_restriction}
                  id={id}
                  onUpdate={handleUpdate}
                  authToken={authToken}
                />
              )}
            </div>
          </div>
          <div className='movie-container'>
            <div className='movie-title'>
              <strong>Inspired by: </strong>{recipe.movie_title}
              {isUserOwner && (
                <UpdateRecipe
                  field='movie_title'
                  initialValue={recipe.movie_title}
                  id={id}
                  onUpdate={handleUpdate}
                  authToken={authToken}
                />
              )}
            </div>
            <div className='movie-genre'>
              <strong>Movie Genre:</strong>{" "}
              {recipe.movie_genre === "sci_fi" ? "sci-fi" : recipe.movie_genre}
              {isUserOwner && (
                <UpdateRecipe
                  field='movie_genre'
                  initialValue={recipe.movie_genre}
                  id={id}
                  onUpdate={handleUpdate}
                  authToken={authToken}
                />
              )}
            </div>
            <button className='button' onClick={toggleMovieInfo}>
              Movie info
            </button>
          </div>
          <div className='movie-info-container'>
            {showMovieInfo && movieInfo && (
              <>
                <p>{movieInfo.overview}</p>
                {/* <p><strong>Released</strong> {movieInfo.release_date}</p> */}
              </>
            )}
          </div>
          <div className='movie-poster'>
            {movieInfo && showMovieInfo && movieInfo.poster_path && (
              <img
                className='image'
                src={`https://image.tmdb.org/t/p/w500${movieInfo.poster_path}`}
                alt={movieInfo.title}
              />
            )}
          </div>
        </>
      )}
      {!recipe && <div>Recipe not found</div>}
      {recipe && (
        <div className='socials'>
          <p><strong>Share</strong></p>
          <FacebookShareButton url={recipeUrl} quote={recipe.title}>
            <img className='social-icon' src={facebookIcon} alt='Facebook' />
          </FacebookShareButton>
          <TwitterShareButton url={recipeUrl} title={recipe.title}>
            <img className='social-icon' src={xIcon} alt='X/Twitter' />
          </TwitterShareButton>
          <PinterestShareButton url={recipeUrl} description={recipe.title} media={pinterestIcon}>
            <img className='social-icon' src={pinterestIcon} alt='Pinterest' />
          </PinterestShareButton>
          <a href='#' onClick={() => window.print()}>
            <img className='social-icon' src={printerIcon} alt='Print' />
          </a>
        </div>
      )}
    </div>
  );
}

export default Recipe;
