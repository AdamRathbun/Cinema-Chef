import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DislikeRecipe({ userId, recipeId, authToken, onLike }) {
  const [isDisliking, setIsDisliking] = useState(false);
  const [disliked, setDisliked] = useState(false);

  useEffect(() => {
    const checkDislikedRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/check-disliked-recipe?user_id=${userId}&recipe_id=${recipeId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setDisliked(response.data.disliked);
      } catch (error) {
        console.error('Error checking disliked recipe:', error);
      }
    };
    checkDislikedRecipe();
  }, [userId, recipeId, authToken]);

  const handleDislike = async () => {
    setIsDisliking(true);
    try {
      if (disliked) {
        await axios.post(
          'http://localhost:5000/delete-dislike',
          { user_id: userId, recipe_id: recipeId },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setDisliked(false);
      } else {
        await axios.post(
          'http://localhost:5000/dislike-recipe',
          { user_id: userId, recipe_id: recipeId },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setDisliked(true);
      }
      onLike();
    } catch (error) {
      console.error('Error disliking recipe:', error);
    } finally {
      setIsDisliking(false);
    }
  };

  return (
    <div>
      <button onClick={handleDislike} disabled={isDisliking}>
        Dislike
      </button>
    </div>
  );
}

export default DislikeRecipe;
