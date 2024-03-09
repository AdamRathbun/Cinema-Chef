import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


const AuthComponent = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [user, setUser] = useState(null);
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');

    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        setUser({ username: decodedToken.username });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleAuth = async () => {
    try {
      const endpoint = isRegister
        ? 'http://localhost:5000/auth/register'
        : 'http://localhost:5000/auth/login';

      const response = await axios.post(endpoint, formData);

      setUser(response.data.user);

      localStorage.setItem('authToken', response.data.token);

      setFormData({
        username: '',
        password: '',
      });
    } catch (error) {
      console.error(`Error during ${isRegister ? 'registration' : 'login'}:`, error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <>
          <h2>{isRegister ? 'Register' : 'Login'}</h2>
          <label>
            Username:
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </label>
          <br />
          <button onClick={handleAuth}>{isRegister ? 'Register' : 'Login'}</button>
          <br />
          <p onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Already have an account? Login here' : 'Need an account? Register here'}
          </p>
        </>
      )}
    </div>
  );
};

export default AuthComponent;
