import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UpdateRecipe({ field, initialValue, onUpdate, id, authToken }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValue(initialValue);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleFileChange = (e) => {
    setValue(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isUpdating) {
      console.log('Update already in progress. Ignoring.');
      return;
    }

    setIsUpdating(true);

    setIsEditing(false);

    try {
      const formData = new FormData();

      formData.append('field', field);
      if (field === 'image') {
        formData.append('image', value);
      } else {
        formData.append('value', value);
      }

      const response = await axios.put(`http://localhost:5000/recipes/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (onUpdate) {
        onUpdate(field, response.data[field]);
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          {field === 'image' ? (
            <>
              <label>Choose new image</label>
              <input type="file" onChange={handleFileChange} accept="image/*" />
            </>
          ) : (
            <>
              <label>{field}</label>
              {field === 'meal_type' && (
                <select value={value} onChange={handleChange}>
                  <option value="">Select Meal Type</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="dessert">Dessert</option>
                </select>
              )}
              {field === 'dietary_restriction' && (
                <select value={value} onChange={handleChange}>
                  <option value="">Select Dietary Restriction</option>
                  <option value="vegan">Vegan</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="gluten_free">Gluten Free</option>
                  <option value="none">None</option>
                </select>
              )}
              {field === 'movie_genre' && (
                <select value={value} onChange={handleChange}>
                  <option value="">Select Movie Genre</option>
                  <option value="action">Action</option>
                  <option value="comedy">Comedy</option>
                  <option value="drama">Drama</option>
                  <option value="thriller">Thriller</option>
                  <option value="horror">Horror</option>
                  <option value="sci_fi">Sci-Fi</option>
                  <option value="fantasy">Fantasy</option>
                  <option value="romance">Romance</option>
                  <option value="animated">Animated</option>
                  <option value="documentary">Documentary</option>
                </select>
              )}
              {(field !== 'meal_type' && field !== 'dietary_restriction' && field !== 'movie_genre') && (
                <textarea name={field} value={value} onChange={handleChange} required />
              )}
            </>
          )}
          <button type="submit">Update</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </form>
      ) : (
        <button type="button" onClick={handleEdit}>Edit {field}</button>
      )}
    </div>
  );
}

export default UpdateRecipe;

