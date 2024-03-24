import React from 'react';
import { Link } from 'react-router-dom';
import AuthComponent from '../Auth/Auth';
import SearchBar from '../SearchBar/SearchBar';
import './Navbar.scss'

function Navbar({ userId }) {

  return (
    <nav className='navbar'>
      <ul className='navbar__list'>
        <li className='navbar__item'>
          <Link to="/" className='navbar__link'>Home</Link>
        </li>
        <li className='navbar__item'>
          <Link to="/user-recipes" className='navbar__link'>Your recipes</Link>
        </li>
        <li className='navbar__item'>
          <Link to="/add-recipe" className='navbar__link'>Add a recipe</Link>
        </li>
        {userId && (
          <li className='navbar__item'>
            <Link to={`/saved-recipes`} className='navbar__link'>Saved recipes</Link>
          </li>
        )}
        <div className='navbar--right'>
          <AuthComponent />
          <SearchBar />
        </div>
      </ul>
    </nav>
  );
}

export default Navbar;
