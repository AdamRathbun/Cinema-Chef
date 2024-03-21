import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LikeRecipe({ userId, recipeId, authToken, onLike }) {
  const [isLiking, setIsLiking] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const checkLikedRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/check-liked-recipe?user_id=${userId}&recipe_id=${recipeId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setLiked(response.data.liked);
      } catch (error) {
        console.error('Error checking liked recipe:', error);
      }
    };
    checkLikedRecipe();
  }, [userId, recipeId, authToken]);

  const handleLike = async () => {
    setIsLiking(true);
    try {
      if (liked) {
        await axios.post(
          'http://localhost:5000/delete-like',
          { user_id: userId, recipe_id: recipeId },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setLiked(liked => !liked);
      } else {
        await axios.post(
          'http://localhost:5000/like-recipe',
          { user_id: userId, recipe_id: recipeId },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setLiked(liked => !liked);
      }
      onLike();
    } catch (error) {
      console.error('Error liking recipe:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div>
      <button onClick={handleLike} disabled={isLiking}>
        Like
      </button>
    </div>
  );
}

export default LikeRecipe;