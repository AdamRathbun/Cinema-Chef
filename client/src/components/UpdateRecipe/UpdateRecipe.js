import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UpdateRecipe({ field, initialValue, onUpdate, id }) {
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
    setValue(e.target.value.toString());
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('Selected File:', file);
    setValue(file);
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

      if (field === 'image') {
        formData.append('field', 'image');
        formData.append('image', value);
      } else {
        formData.append('field', field);
        formData.append('value', value.toString());
      }

      console.log('FormData:', formData);

      const response = await axios.put(`http://localhost:5000/recipes/${id}`, formData);

      if (onUpdate) {
        console.log('Calling onUpdate with:', field, response.data[field]);
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
              <input type="file" onChange={handleFileChange} accept="image/*" value={undefined} />

            </>
          ) : (
            <>
              <label>{field}</label>
              <textarea name={field} value={value} onChange={handleChange} required />
            </>
          )}
          <button type="submit">Update</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      ) : (
        <button type="button" onClick={handleEdit}>
          Edit {field}
        </button>
      )}
    </div>
  );
}

export default UpdateRecipe;

