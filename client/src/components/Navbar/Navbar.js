import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthComponent from '../Auth/Auth';
import SearchBar from '../SearchBar/SearchBar';
import './Navbar.scss'
import menuIcon from '../../assets/bars.png'

function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClick = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className='navbar'>
      <div className='menu-and-logo-container'>
        <div className="menu-toggle" onClick={handleMenuToggle}>
          <img src={menuIcon} alt="Menu" />
        </div>
        <h2 className='logo'>
          <Link to="/" className='navbar__link'>CinemaChef</Link>
        </h2>
      </div>
      {isMenuOpen && <div className="overlay" onClick={handleMenuToggle} />}
      {isMenuOpen && (
        <ul className={`dropdown-menu ${isMenuOpen ? 'open' : ''}`}>
          <li className={`navbar__item ${location.pathname === '/' ? 'active' : ''}`} onClick={handleMenuClick}>
            <Link to="/" className='navbar__link'>Home</Link>
          </li>
          <li className={`navbar__item ${location.pathname === '/user-recipes' ? 'active' : ''}`} onClick={handleMenuClick}>
            <Link to="/user-recipes" className='navbar__link'>Your recipes</Link>
          </li>
          <li className={`navbar__item ${location.pathname === '/saved-recipes' ? 'active' : ''}`} onClick={handleMenuClick}>
            <Link to={`/saved-recipes`} className='navbar__link'>Saved recipes</Link>
          </li>
          <li className={`navbar__item ${location.pathname === '/add-recipe' ? 'active' : ''}`} onClick={handleMenuClick}>
            <Link to="/add-recipe" className='navbar__link'>Add a recipe</Link>
          </li>
          <div className='navbar__login'>
            <AuthComponent />
          </div>
        </ul>
      )}
      <ul className='navbar__list'>
        <li className={`navbar__item ${location.pathname === '/' ? 'active' : ''}`}>
          <Link to="/" className='navbar__link'>Home</Link>
        </li>
        <li className={`navbar__item ${location.pathname === '/user-recipes' ? 'active' : ''}`}>
          <Link to="/user-recipes" className='navbar__link'>Your recipes</Link>
        </li>
        <li className={`navbar__item ${location.pathname === '/saved-recipes' ? 'active' : ''}`}>
          <Link to={`/saved-recipes`} className='navbar__link'>Saved recipes</Link>
        </li>
        <li className={`navbar__item ${location.pathname === '/add-recipe' ? 'active' : ''}`}>
          <Link to="/add-recipe" className='navbar__link'>Add a recipe</Link>
        </li>
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