import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateRecipe.scss';

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

    let formData = new FormData();
    if (field === 'image' && value instanceof File) {
      formData.append('image', value, value.name);
    } else {
      formData.append(field, value);
    }
    formData.append('field', field);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${authToken}`,
      },
    };

    try {
      const response = await axios.put(`http://localhost:5000/recipes/${id}`, formData, config);

      if (response.data && onUpdate) {
        onUpdate(field, response.data[field]);
      } else {
        console.error(`No data returned from server when updating ${field}`);
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error.response ? error.response.data : error);
    } finally {
      setIsUpdating(false);
    }
  };


  return (
    <div>
      {isEditing ? (
        <form className='form-container' onSubmit={handleSubmit}>
          {field === 'image' ? (
            <>
              <label>Choose new image</label>
              <input type="file" onChange={handleFileChange} accept="image/*" />
            </>
          ) : (
            <>
              {field === 'meal_type' && (
                <select value={value} onChange={handleChange}>
                  <option value="">Category</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="dessert">Dessert</option>
                  <option value="drink">Drink</option>
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
                <textarea
                  name={field}
                  value={value}
                  onChange={handleChange}
                  required
                  className={(field === 'description' || field === 'instructions') ? 'min-height-field' : (field === 'ingredients') ? 'min-height-field--small' : ''}
                />
              )}
            </>
          )}
          <div className='update-button-container'>
            <button className='update-button' type="submit">Update</button>
            <button className='update-button' type="button" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      ) : (
        <button className='update-button' type="button" onClick={handleEdit}>Edit</button>
      )}
    </div>
  );
}

export default UpdateRecipe;

