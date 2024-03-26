import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthComponent from '../Auth/Auth';
import SearchBar from '../SearchBar/SearchBar';
import './Navbar.scss'

function Navbar({ userId }) {
  const location = useLocation()

  return (
    <nav className='navbar'>
      <h2 className='logo'>
        <Link to="/" className='navbar__link'>CinemaChef</Link>
      </h2>
      <ul className='navbar__list'>
        {/* <li className='navbar__item'> */}
        <li className={`navbar__item ${location.pathname === '/' ? 'active' : ''}`}>
          <Link to="/" className='navbar__link'>Home</Link>
        </li>
        <li className={`navbar__item ${location.pathname === '/user-recipes' ? 'active' : ''}`}>
          <Link to="/user-recipes" className='navbar__link'>Your recipes</Link>
        </li>
        <li className={`navbar__item ${location.pathname === '/add-recipe' ? 'active' : ''}`}>
          <Link to="/add-recipe" className='navbar__link'>Add a recipe</Link>
        </li>
        {userId && (
          <li className={`navbar__item ${location.pathname === '/saved-recipes' ? 'active' : ''}`}>
            <Link to={`/saved-recipes`} className='navbar__link'>Saved recipes</Link>
          </li>
        )}
      </ul>
      <div className='navbar--right'>
        <SearchBar />
        <div className='navbar__login'>
          <AuthComponent />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
