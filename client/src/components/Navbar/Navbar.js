import React from 'react';
import './Navbar.css';

import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className='navbar'>
      <ul className='navbar-nav'>
        <li className='navbar-item'>
          <Link to="/">Home</Link>
        </li>
        <li className='navbar-item'>
          <Link to="/recipes">Recipes</Link>
        </li>
        <li className='navbar-item'>
          <Link to="/add-recipe">Add Recipe</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;