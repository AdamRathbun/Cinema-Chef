import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UpdateRecipe({ recipeId }) {
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    movie_title: '',
    image: null
  });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/recipes/${recipeId}`);
        const { data } = response;
        setFormData({
          title: data.title,
          ingredients: data.ingredients,
          instructions: data.instructions,
          movie_title: data.movie_title,
        });
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'image' && e.target.files.length > 0) {
      setFormData({
        ...formData,
        image: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recipeData = new FormData();
    recipeData.append('title', formData.title);
    recipeData.append('ingredients', formData.ingredients);
    recipeData.append('instructions', formData.instructions);
    recipeData.append('movie_title', formData.movie_title);
    recipeData.append('image', formData.image);

    try {
      const response = await axios.put(`http://localhost:5000/recipes/${recipeId}`, recipeData);
      console.log('Recipe updated:', response.data);
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  return (
    <div>
      <h2>Update Recipe</h2>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type='text'
          name='title'
          value={formData.title}
          onChange={handleChange}
          required
        />
        <label>Ingredients</label>
        <textarea
          name='ingredients'
          value={formData.ingredients}
          onChange={handleChange}
          required
        />
        <label>Instructions</label>
        <textarea
          name='instructions'
          value={formData.instructions}
          onChange={handleChange}
          required
        />
        <label>Movie Title</label>
        <textarea
          name='movie_title'
          value={formData.movie_title}
          onChange={handleChange}
          required
        />
        <label>Image</label>
        <input
          type='file'
          name='image'
          onChange={handleChange}
        />
        <button type='submit'>Update</button>
      </form>
    </div>
  );
}

export default UpdateRecipe;
