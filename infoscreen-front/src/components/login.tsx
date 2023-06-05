import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
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
                console.log("Authenticated");
            }
        } catch (error) {
            console.error('Error during authentication:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button type="submit">Login</button>
        </form>
        );
};

export default Login;
