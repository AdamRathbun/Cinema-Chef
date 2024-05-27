import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import AddRecipe from './components/AddRecipe/AddRecipe'
import Recipe from './components/Recipe/Recipe'
import YourRecipes from './components/YourRecipes/YourRecipes';
import SavedRecipes from './components/SavedRecipes/SavedRecipes';
import SearchResults from './components/SearchResults/SearchResults';
import SearchBarResults from './components/SearchBarResults/SearchBarResults';
import SupabaseAuth from './components/Auth2/Auth';
import Footer from './components/Footer/Footer';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');

    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        setUserId(decodedToken.userId);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  return (
    <Router>
      <Navbar userId={userId} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/add-recipe' element={<AddRecipe />} />
        <Route path='/user-recipes' element={<YourRecipes />} />
        <Route path='/saved-recipes' element={<SavedRecipes />} />
        <Route path='/recipes/:id' element={<Recipe />} />
        <Route path="/search/:searchType/:searchTerm" element={<SearchResults />} />
        <Route path='/search/recipe-name/:searchTerm' element={<SearchBarResults />} />
        <Route path='/login' element={<SupabaseAuth />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
