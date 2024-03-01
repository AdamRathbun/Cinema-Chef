import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import DeleteRecipe from '../DeleteRecipe/DeleteRecipe';
import UpdateRecipe from '../UpdateRecipe/UpdateRecipe';

function Recipe() {
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/recipes/${id}`)
      .then((response) => {
        console.log('Recipe data:', response.data);
        setRecipe(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching recipe:', error);
        setIsLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/recipes/${id}`);

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
      if (!recipe) {
        console.error('Recipe data not available.');
        return;
      }

      const updateData = {
        field,
        value: updatedValue,
      };

      const response = await axios.put(`http://localhost:5000/recipes/${id}`, updateData);

      console.log(`Recipe ${field} updated:`, response.data);

      setRecipe(response.data);
    } catch (error) {
      console.error(`Error updating ${field}:`, error.response?.data || error.message);
    } finally {
      setIsUpdating(false);
    }
  };


  return (
    <div className="recipe">
      {recipe && (
        <>
          <h2 className="recipe_title">{recipe.title}</h2>
          <p className="recipe_movie_title">
            <strong>Movie Title:</strong> {recipe.movie_title}
          </p>
          {recipe.image && <img className="recipe_image" src={recipe.image} alt={recipe.title} />}
          <p className="recipe_ingredients">
            <strong>Ingredients:</strong> {recipe.ingredients}
          </p>
          <p className="recipe_instructions">
            <strong>Instructions:</strong> {recipe.instructions}
          </p>
          <UpdateRecipe field="title" initialValue={recipe.title} id={id} onUpdate={handleUpdate} />
          <UpdateRecipe
            field="ingredients"
            initialValue={recipe.ingredients}
            id={id}
            onUpdate={handleUpdate}
          />
          <UpdateRecipe
            field="instructions"
            initialValue={recipe.instructions}
            id={id}
            onUpdate={handleUpdate}
          />
          <UpdateRecipe
            field="movie_title"
            initialValue={recipe.movie_title}
            id={id}
            onUpdate={handleUpdate}
          />
          <UpdateRecipe field="image" initialValue={recipe.image} id={id} onUpdate={handleUpdate} />
          <DeleteRecipe recipeId={id} onDelete={handleDelete} />
        </>
      )}
      {!recipe && <div>Recipe not found</div>}
    </div>
  );
}

export default Recipe;