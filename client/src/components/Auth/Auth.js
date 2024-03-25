import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './Auth.scss';

const AuthComponent = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [user, setUser] = useState(null);
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);
  const [isRegisterFormVisible, setIsRegisterFormVisible] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');

    const logoutUser = () => {
      setUser(null);
      localStorage.removeItem('authToken');
    };

    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          logoutUser();
        } else {
          setUser({ username: decodedToken.username });
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        logoutUser();
      }
    }
  }, []);

  const handleAuth = async () => {
    try {
      const endpoint = isRegisterFormVisible
        ? 'http://localhost:5000/auth/register'
        : 'http://localhost:5000/auth/login';

      const response = await axios.post(endpoint, formData);
      setUser(response.data.user);

      localStorage.setItem('authToken', response.data.token);
      setFormData({ username: '', password: '' });
      window.location.reload();
    } catch (error) {
      console.error(`Error during ${isRegisterFormVisible ? 'registration' : 'login'}:`, error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    window.location.reload();
  };

  const toggleLoginFormVisibility = () => {
    setIsRegisterFormVisible(false);
    setIsLoginFormVisible(!isLoginFormVisible);
  };

  const toggleRegisterFormVisibility = () => {
    setIsLoginFormVisible(false);
    setIsRegisterFormVisible(!isRegisterFormVisible);
  };

  //   return (
  //     <div className="auth-container">
  //       {user ? (
  //         <div>
  //           <p>Welcome, {user.username}!</p>
  //           <button onClick={handleLogout}>Logout</button>
  //         </div>
  //       ) : (
  //         <div className="auth-content">
  //           {isLoginFormVisible && (
  //             <div className="auth-form">
  //               <label>
  //                 Username:
  //                 <input
  //                   type="text"
  //                   value={formData.username}
  //                   onChange={(e) => setFormData({ ...formData, username: e.target.value })}
  //                 />
  //               </label>
  //               <label>
  //                 Password:
  //                 <input
  //                   type="password"
  //                   value={formData.password}
  //                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
  //                 />
  //               </label>
  //               <button className="auth-message" onClick={handleAuth}>Login</button>
  //               <div className="auth-message" onClick={toggleRegisterFormVisibility}>Need to register?</div>
  //             </div>
  //           )}
  //           {isRegisterFormVisible && (
  //             <div className="auth-form">
  //               <label>
  //                 Username:
  //                 <input
  //                   type="text"
  //                   value={formData.username}
  //                   onChange={(e) => setFormData({ ...formData, username: e.target.value })}
  //                 />
  //               </label>
  //               <label>
  //                 Password:
  //                 <input
  //                   type="password"
  //                   value={formData.password}
  //                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
  //                 />
  //               </label>
  //               <button className="auth-message" onClick={handleAuth}>Register</button>
  //               <div className="auth-message" onClick={toggleLoginFormVisibility}>Want to login?</div>
  //             </div>
  //           )}
  //           {!isLoginFormVisible && !isRegisterFormVisible && (
  //             <div className="auth-options">
  //               <div className="auth-message" onClick={toggleLoginFormVisibility}>Login</div>
  //             </div>
  //           )}
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  // export default AuthComponent;


  return (
    <div className="auth-container">
      {user ? (
        <div>
          <p>Welcome, {user.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="auth-content">
          {isLoginFormVisible && (
            <div className="auth-form">
              <label>
                Username:
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </label>
              <div className="auth-buttons">
                <button className="auth-button" onClick={handleAuth}>Login</button>
                <div className="auth-message" onClick={toggleRegisterFormVisibility}>Need to register?</div>
              </div>
            </div>
          )}
          {isRegisterFormVisible && (
            <div className="auth-form">
              <label>
                Username:
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </label>
              <div className="auth-buttons">
                <button className="auth-button" onClick={handleAuth}>Register</button>
                <div className="auth-message" onClick={toggleRegisterFormVisibility}>Login to account.</div>
              </div>
            </div>
          )}
          {!isLoginFormVisible && !isRegisterFormVisible && (
            <div className="auth-options">
              <div className="auth-message" onClick={toggleLoginFormVisibility}>Login</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthComponent;
