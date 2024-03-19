import React, { useState } from 'react';
import axios from 'axios';

function SaveRecipe({ recipeId, userId, authToken }) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (isSaving) {
      console.log('Save already in progress. Ignoring.');
      return;
    }

    setIsSaving(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/save-recipe',
        { user_id: userId, recipe_id: recipeId },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Recipe saved:', response.data);
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
    </div>
  );
}

export default SaveRecipe;
