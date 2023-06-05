import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginSuccess from "./LoginSuccess";
import { API_BASE_URL } from '../apiConfig';
import bgImage from '../components/img/bg.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });

      // If successful, store the auth tokens
      if (response.data) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('userIdent', response.data.userIdent);
        setIsLoginSuccess(true);
        setTimeout(() => navigate('/'), 8000); // Redirect after 3 seconds
      }
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };

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
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
