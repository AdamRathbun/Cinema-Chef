import React, { useState } from 'react';
import axios from 'axios';

function SaveRecipe({ recipeId, userId, authToken }) {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    if (isSaving) {
      console.log('Save already in progress. Ignoring.');
      return;
    }

    setIsSaving(true);

    try {
      await axios.post(
        // *need to update later with hosting
        'https://cinema-chef.onrender.com/save-recipe',
        { user_id: userId, recipe_id: recipeId },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage('Recipe saved!');
    } catch (error) {
      console.error('Error saving recipe:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <button onClick={handleSave} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Recipe'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default SaveRecipe;