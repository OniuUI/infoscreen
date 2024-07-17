import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'; // Updated import for GoogleLogin
import MicrosoftLogin from 'react-microsoft-login'; // Updated import for MicrosoftLogin
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
    // Cleanup on component unmount
    return () => {
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
    };
  }, []);

  const updateLocalStorageAsync = (data: { accessToken: string; refreshToken: string; userIdent: string; role: string; expiresIn: number }) => {
    return new Promise<void>((resolve) => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('userIdent', data.userIdent);
      localStorage.setItem('userRole', data.role);
      resolve();
    });
  };

  const handleGoogleSuccess = (response: any) => {
    console.log('Google login success:', response);
    // Process login success, e.g., setting user state, redirecting, etc.
  };

  // Handler for Google login failure
  const handleGoogleFailure = () => {
    console.error('Google login failed');
    // Additional logic to handle the error can be added here
  };

  // Handler for Microsoft login success/failure
  const handleMicrosoftResponse = (err: any, data: any, msal: any) => {
    if (err) {
      console.error('Microsoft login failed:', err);
      // Process login failure
    } else {
      console.log('Microsoft login success:', data);
      // Process login success
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoginFailure(false); // Reset the failure state on each login attempt

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      console.log("login success")
      const data = await response.json();

      if (response.status !== 200) {
        throw new Error(data.message);
      }

      // If successful, store the auth tokens and role
      await updateLocalStorageAsync(data);

      if(logoutTimer) {
        clearTimeout(logoutTimer);
      }


      setIsLoginSuccess(true);
      setTimeout(() => navigate('/'), 3000); // Redirect after 3 seconds
      if (data) {
        // Handle normal user login success
        setIsLoginSuccess(true);
        setTimeout(() => navigate('/'), 3000); // Redirect after 3 seconds
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setTimeout(() => setIsLoginFailure(true), 1500); // Reset the failure state after 1.5 seconds
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
                style={{
                  backgroundColor: 'white',
                  padding: '2em',
                  borderRadius: '8px',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                }}
            >
              <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
              />
              <div>Microsoft login</div>
              <MicrosoftLogin
                  clientId="YOUR_MICROSOFT_CLIENT_ID" // Replace with your actual Microsoft client ID
                  authCallback={handleMicrosoftResponse}
              >
                <button style={{ backgroundColor: '#2F2F2F', color: 'white', padding: '10px', borderRadius: '5px' }}>
                  Login with Microsoft
                </button>
              </MicrosoftLogin>

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
              {isLoginFailure && (
                  <p style={{ color: 'red', marginTop: '1em' }}>
                    Incorrect email or password.
                  </p>
              )}
            </div>
        )}
      </div>
  );
};

export default Login;