import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import AddRecipe from './components/AddRecipe/AddRecipe'
import Recipe from './components/Recipe/Recipe'
import YourRecipes from './components/YourRecipes/YourRecipes';
import SearchResults from './components/SearchResults/SearchResults';
import SearchBarResults from './components/SearchBarResults/SearchBarResults';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/add-recipe' element={<AddRecipe />} />
        <Route path='/user-recipes' element={<YourRecipes />} />
        <Route path='/recipes/:id' element={<Recipe />} />
        <Route path="/search/:searchType/:searchTerm" element={<SearchResults />} />
        <Route path='/search/recipe-name/:searchTerm' element={<SearchBarResults />} />
      </Routes>
    </Router>
  );
}

export default App;
