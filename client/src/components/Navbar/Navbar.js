import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import './Navbar.scss';
import menuIcon from '../../assets/bars.png';
import { createClient } from '@supabase/supabase-js';

import { useNavigate } from 'react-router-dom';

const supabase = createClient('https://bwzptqnuytalrgtwhhim.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3enB0cW51eXRhbHJndHdoaGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM0NzIyMzEsImV4cCI6MjAyOTA0ODIzMX0.Lxr25RL-sNfN4_Xv8_Td3mjmMzTVtm4r6r4rerQVnhc')

function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data) {
          const userEmail = data.session.user.email;
          setUserEmail(userEmail.split('@')[0]);
        }
      } catch (error) {
        console.error('Error fetching user session:', error.message);
      }
    };

    getUserEmail();
  }, [userEmail, navigate]);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClick = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUserEmail(null);
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <nav className='navbar'>
      <div className='menu-and-logo-container'>
        <div className="menu-toggle" onClick={handleMenuToggle}>
          <img src={menuIcon} alt="Menu" />
        </div>
        <h2 className='logo'>
          <Link to="/" className='navbar__link'>Cinema Chef</Link>
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
          {userEmail ? (
            <li className={`navbar__item top-spacing`} onClick={handleMenuClick}>
              <span>Welcome, {userEmail}</span>
              <button className='logout-button' onClick={handleLogout}>Logout</button>
            </li>
          ) : (
            <li className={`navbar__item ${location.pathname === '/login' ? 'active' : ''}`} onClick={handleMenuClick}>
              <Link to="/login" className='navbar__link left'>Login</Link>
            </li>
          )}
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
          {userEmail ? (
            <div className='navbar__item' onClick={handleMenuClick}>
              <span>Welcome, {userEmail}</span>
              <button className='logout-button' onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className={`navbar__item ${location.pathname === '/login' ? 'active' : ''}`} onClick={handleMenuClick}>
              <Link to="/login" className='navbar__link left'>Login</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
