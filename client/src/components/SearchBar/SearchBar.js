import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SearchBar.scss';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      if (!query.trim()) {
        console.log('Please enter a search query');
        return;
      }

      // *need to update later with hosting
      const response = await axios.get(`http://localhost:5000/recipes/search/recipe-name/${query}`);
      const searchResults = response.data;

      console.log('Search results:', searchResults);
      navigate(`/search/recipe-name/${query}`);
      setQuery('');
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div className="search-container">
      <form className="search-form" onSubmit={handleSearch}>
        <input className="search-input" type="text" value={query} onChange={handleChange} placeholder="Search for recipes" />
        <button className="search-button" type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchBar;