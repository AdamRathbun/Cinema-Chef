import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import AuthComponent from '../Auth/Auth';
import SearchBar from '../SearchBar/SearchBar';

function Navbar() {
  return (
    <nav className='navbar'>
      <ul className='navbar-nav'>
        <li className='navbar-item'>
          <Link to="/">Home</Link>
        </li>
        <li className='navbar-item'>
          <Link to="/user-recipes">Your recipes</Link>
        </li>
        <li className='navbar-item'>
          <Link to="/add-recipe">Add a recipe</Link>
        </li>
        <li>
          <AuthComponent />
        </li>
        <li>
          <SearchBar />
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;