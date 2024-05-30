import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

function UnsaveRecipe({ recipeId, userId, authToken }) {
  const [isUnsaving, setIsUnsaving] = useState(false);
  const navigate = useNavigate();

  const handleUnsave = async () => {
    try {
      setIsUnsaving(true);

      // *need to update later with hosting
      await axios.delete(`https://cinema-chef.onrender.com/unsave-recipe`, {
        data: {
          user_id: userId,
          recipe_id: recipeId,
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      navigate('/');
    } catch (error) {
      console.error('Error unsaving recipe:', error);
    } finally {
      setIsUnsaving(false);
    }
  };

  return (
    <div>
      <button onClick={handleUnsave} disabled={isUnsaving}>
        {isUnsaving ? 'Unsaving...' : 'Unsave Recipe'}
      </button>
    </div>
  );
}

export default UnsaveRecipe;
