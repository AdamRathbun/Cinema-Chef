// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Home from './components/Home/Home';
// import Navbar from './components/Navbar/Navbar';
// import AddRecipe from './components/AddRecipe/AddRecipe'
// import Recipe from './components/Recipe/Recipe'
// import YourRecipes from './components/YourRecipes/YourRecipes';
// import SavedRecipes from './components/SavedRecipes/SavedRecipes';
// import SearchResults from './components/SearchResults/SearchResults';
// import SearchBarResults from './components/SearchBarResults/SearchBarResults';

// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path='/' element={<Home />} />
//         <Route path='/add-recipe' element={<AddRecipe />} />
//         <Route path='/user-recipes' element={<YourRecipes />} />
//         <Route path='/saved-recipes' element={<SavedRecipes />} />
//         <Route path='/recipes/:id' element={<Recipe />} />
//         <Route path="/search/:searchType/:searchTerm" element={<SearchResults />} />
//         <Route path='/search/recipe-name/:searchTerm' element={<SearchBarResults />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

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
      </Routes>
    </Router>
  );
}

export default App;
