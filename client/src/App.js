import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import AddRecipe from './components/AddRecipe/AddRecipe'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/add-recipe' element={<AddRecipe />} />
      </Routes>
    </Router>
  );
}

export default App;
