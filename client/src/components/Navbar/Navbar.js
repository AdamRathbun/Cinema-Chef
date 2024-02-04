import React from 'react';
import "./Navbar.css";

function Navbar() {
  return (
    <nav className='navbar'>
      <ul className='navbar-nav'>
        <li className='navbar-item'>
          <a href='/'>Home</a>
        </li>
        <li className='navbar-item'>
          <a href='/recipes'>Recipes</a>
        </li>
        <li className='navbar-item'>
          <a href='/add-recipe'>Add Recipe</a>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar;