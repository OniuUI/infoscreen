import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginSuccess from "./LoginSuccess";
import { API_BASE_URL } from '../apiConfig';
import bgImage from '../components/img/bg.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  const [isLoginFailure, setIsLoginFailure] = useState(false); // New state
  const navigate = useNavigate();
  let logoutTimer: any;

  useEffect(() => {
    return () => {
      if(logoutTimer) {
        clearTimeout(logoutTimer);
      }
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoginFailure(false); // Reset the failure state on each login attempt

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });

      // If successful, store the auth tokens and role
      if (response.data) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('userIdent', response.data.userIdent);
        localStorage.setItem('role', response.data.role); // Set the role in local storage

        if(logoutTimer) {
          clearTimeout(logoutTimer);
        }

        logoutTimer = setTimeout(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userIdent');
          localStorage.removeItem('role'); // Remove the role from local storage when the token expires
        }, response.data.expiresIn * 1000);

        setIsLoginSuccess(true);
        setTimeout(() => navigate('/'), 3000); // Redirect after 3 seconds
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setIsLoginFailure(true); // Set the failure state on login failure
      setTimeout(() => setIsLoginFailure(false), 1500); // Reset the failure state after 1.5 seconds
    }
  };

  // Add the shake class to the container div when login fails
  const containerClasses = isLoginFailure ? 'shake' : '';

  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isLoginSuccess ? (
        <LoginSuccess />
      ) : (
        <div
          className={containerClasses}
          style={{
            backgroundColor: 'white',
            padding: '2em',
            borderRadius: '8px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="Email"
              style={{
                marginBottom: '1em',
                padding: '0.5em',
                width: '100%',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <input
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="Password"
              style={{
                marginBottom: '1em',
                padding: '0.5em',
                width: '100%',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: 'green',
                color: 'white',
                padding: '0.75em',
                width: '100%',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Login
            </button>

            {isLoginFailure && (
              <p style={{ color: 'red', marginTop: '1em' }}>
                Incorrect email or password.
              </p>
              )}
          </form>
        </div>
        )}
    </div>
    );
};

export default Login;