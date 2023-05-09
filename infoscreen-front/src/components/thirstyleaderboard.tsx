// src/components/ThirstyLeaderboard.tsx
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from "../apiConfig"; // Import the API_BASE_URL

interface User {
    firstName: string;
    lastName: string;
    imageUrl: string;
    coffee: number;
    soda: number;
}

const ThirstyLeaderboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/users`);
                const data = await response.json();
                const filteredUsers = data.users.filter(
                    (user: User) => user.coffee > 0 || user.soda > 0
                    );
                const sortedUsers = filteredUsers.sort(
                    (a: User, b: User) => b.coffee + b.soda - a.coffee - a.soda
                    );
                setUsers(sortedUsers);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUsers();
        const interval = setInterval(() => {
            fetchUsers();
            }, 60 * 250); // 60 * 1000 ms = 15 sec

        // Clean up the interval when the component is unmounted
        return () => clearInterval(interval);
        }, []);
    
    const [winner, ...rest] = users;

    return (
        <div>
            <h1>Workaholic of the day</h1>
            {winner && (
                <div style={{ textAlign: 'center' }}>
                    <img
                        src={winner.imageUrl}
                        alt={`${winner.firstName} ${winner.lastName}`}
                        style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                    />
                    <div>👑</div>
                    <h2>
                        {winner.firstName} {winner.lastName}
                    </h2>
                    <p>
                        ☕: {winner.coffee}, 🥤: {winner.soda}
                    </p>
                </div>
                )}
                <div>
                {rest.map((user, index) => (
                    <div key={index}>
                        <h4>
                            {user.firstName} {user.lastName} ☕: {user.coffee}, 🥤: {user.soda}
                        </h4>
                    </div>
                    ))}
            </div>
        </div>
        );
};

export default ThirstyLeaderboard;
