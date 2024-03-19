import React, { useState } from 'react';
import axios from 'axios';

function UnsaveRecipe({ recipeId, userId, authToken }) {
  const [isUnsaving, setIsUnsaving] = useState(false);

  const handleUnsave = async () => {
    try {
      setIsUnsaving(true);

      const response = await axios.delete(`http://localhost:5000/unsave-recipe`, {
        data: {
          user_id: userId,
          recipe_id: recipeId,
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log('Unsave recipe response:', response.data);
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
