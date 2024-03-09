import React from 'react';
import axios from 'axios';

const DeleteRecipe = ({ recipeId, onDelete, authToken }) => {
  const handleDelete = async () => {
    try {
      if (!authToken) {
        console.error('Authentication token is missing.');
        return;
      }

      const response = await axios.delete(`http://localhost:5000/recipes/${recipeId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        if (onDelete) {
          onDelete();
        }
      } else {
        console.error('Failed to delete recipe:', response.data);
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  return (
    <button onClick={handleDelete}>
      Delete Recipe
    </button>
  );
};

export default DeleteRecipe;
