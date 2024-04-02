import React from 'react'
import './Footer.scss'

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footer-container'>
        <div className='links'>
          <a href='/'>Home</a>
          <a href='/user-recipes'>Your recipes</a>
          <a href='/saved-recipes'>Saved recipes</a>
          <a href='/add-recipe'>Add a recipe</a>
        </div>
        <div className='rights'>
          <p>&copy; 2024 CinemaChef. All rights reserved.</p>
          <p>Designed and developed by Adam Rathbun.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer