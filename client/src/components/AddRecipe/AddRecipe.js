import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddRecipe() {
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    movie_title: '',
    image: null,
  });

  const [message, setMessage] = useState(null);

  const authToken = localStorage.getItem('authToken');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('ingredients', formData.ingredients);
      form.append('instructions', formData.instructions);
      form.append('movie_title', formData.movie_title);

      if (formData.image) {
        form.append('image', formData.image);

        const uploadResponse = await axios.post('http://localhost:5000/upload-image', form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authToken}`,
          },
        });

        const imageUrl = uploadResponse.data.imageUrl;

        await axios.post('http://localhost:5000/recipes-with-image', { ...formData, imageUrl }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });
      } else {
        await axios.post('http://localhost:5000/recipes-without-image', form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authToken}`,
          },
        });
      }

      setMessage('Recipe added!');
    } catch (error) {
      console.error('Error uploading data:', error);
      setMessage('Error adding the recipe—try again.');
    }
  };


  return (
    <div>
      <h2>Add Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type='text'
            name='title'
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Ingredients</label>
          <textarea
            name='ingredients'
            value={formData.ingredients}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Instructions</label>
          <textarea
            name='instructions'
            value={formData.instructions}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Movie Title</label>
          <textarea
            name='movie_title'
            value={formData.movie_title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Image</label>
          <input
            type='file'
            name='image'
            onChange={handleImageChange}
          />
        </div>
        <button type='submit'>Submit</button>
      </form>
      {message && <div>{message}</div>}
    </div>
  );
}

export default AddRecipe;
