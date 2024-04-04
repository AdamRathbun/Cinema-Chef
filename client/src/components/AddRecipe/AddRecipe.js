import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import './AddRecipe.scss'

function AddRecipe() {
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    movie_title: '',
    image: null,
    meal_type: '',
    dietary_restriction: 'none',
    movie_genre: '',
    description: '',
    prep_time: '',
  });

  const navigate = useNavigate();

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
      form.append('meal_type', formData.meal_type);
      form.append('dietary_restriction', formData.dietary_restriction);
      form.append('movie_genre', formData.movie_genre);
      form.append('description', formData.description);
      form.append('prep_time', formData.prep_time);

      if (formData.image) {
        form.append('image', formData.image);

        // *need to update later with hosting
        const uploadResponse = await axios.post('http://localhost:5000/upload-image', form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authToken}`,
          },
        });

        const imageUrl = uploadResponse.data.imageUrl;

        // *need to update later with hosting
        await axios.post('http://localhost:5000/recipes-with-image', { ...formData, imageUrl }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });
      } else {
        // *need to update later with hosting
        await axios.post('http://localhost:5000/recipes-without-image', form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authToken}`,
          },
        });
      }

      setMessage('Recipe added!');
      navigate('/')
    } catch (error) {
      console.error('Error uploading data:', error);
      setMessage('Sign in to create your new recipe!');
    }
  };

  return (
    <div className='add-recipe-container'>
      <h2>What are you cooking up?</h2>
      <form onSubmit={handleSubmit}>
        <div className='form--small'>
          <label>Recipe Title</label>
          <input
            type='text'
            name='title'
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <div className='form--small'>
            <label>Prep Time (e.g. 1 hour and 30mins)</label>
            <input
              name='prep_time'
              value={formData.prep_time}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className='form'>
          <label>Description</label>
          <p>Talk a little about your recipe, how you got the idea, what makes it one of your favorites, etc.</p>
          <textarea
            name='description'
            value={formData.description}
            onChange={handleChange}
            className='min-height-field'
          />
        </div>
        <div className='form'>
          <label>Ingredients</label>
          <p>Write out your ingredients along with the measurement (e.g. 1 cup of flour).</p>
          <textarea
            name='ingredients'
            value={formData.ingredients}
            onChange={handleChange}
            className='min-height-field--small'
            required
          />
        </div>
        <div className='form'>
          <label>Instructions</label>
          <p>Detail how to make your recipe, including preparation method, pan sizes, oven temperatures, etc.</p>
          <textarea
            name='instructions'
            value={formData.instructions}
            onChange={handleChange}
            className='min-height-field'
            required
          />
        </div>
        <div className='meal-type-and-diet'>
          <div className='selection'>
            <label>Meal Type</label>
            <select name='meal_type' value={formData.meal_type} onChange={handleChange}>
              <option value=''>Category</option>
              <option value='breakfast'>Breakfast</option>
              <option value='lunch'>Lunch</option>
              <option value='dinner'>Dinner</option>
              <option value='dessert'>Dessert</option>
              <option value='drink'>Drink</option>
            </select>
          </div>
          <div className='selection'>
            <label>Dietary Restriction</label>
            <select name='dietary_restriction' value={formData.dietary_restriction} onChange={handleChange}>
              <option value=''>Select Dietary Restriction</option>
              <option value='vegan'>Vegan</option>
              <option value='vegetarian'>Vegetarian</option>
              <option value='gluten_free'>Gluten-free</option>
              <option value='none'>None</option>
            </select>
          </div>
        </div>
        <div className='form--small'>
          <label>Movie Inspiration</label>
          <input
            name='movie_title'
            value={formData.movie_title}
            onChange={handleChange}
            required
          />
        </div>
        <div className='selection'>
          <label>Movie Genre</label>
          <select name='movie_genre' value={formData.movie_genre} onChange={handleChange}>
            <option value=''>Select Movie Genre</option>
            <option value='action'>Action</option>
            <option value='comedy'>Comedy</option>
            <option value='drama'>Drama</option>
            <option value='thriller'>Thriller</option>
            <option value='horror'>Horror</option>
            <option value='sci_fi'>Sci-Fi</option>
            <option value='fantasy'>Fantasy</option>
            <option value='romance'>Romance</option>
            <option value='animated'>Animated</option>
            <option value='documentary'>Documentary</option>
          </select>
        </div>
        <div className='selection'>
          <label>Image</label>
          <input type='file' name='image' onChange={handleImageChange} />
        </div>
        <button className='button--submit' type='submit'>Submit</button>
      </form>
      {message && <div>{message}</div>}
    </div>
  );
}

export default AddRecipe;
