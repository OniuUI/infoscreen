// src/components/ThirstyLeaderboard.tsx
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from "../apiConfig"; // Import the API_BASE_URL
import './css/leaderboard.css';
import workaholic from './img/workaholic.svg';

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
    
    const [winner, second, third, ...rest] = users;

    return (
        <div className="leaderboard">
            <img src={workaholic} alt="Workaholic of the day" />
            {winner && (
                <div className="winner">
                    <img
                        src={winner.imageUrl}
                        alt={`${winner.firstName} ${winner.lastName}`}
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

            <div className="runner-up">
                {second && (
                    <div className="second-place">
                        <div>🥈</div>
                        <h3>{second.firstName} {second.lastName}</h3>
                        <p>☕: {second.coffee}, 🥤: {second.soda}</p>
                    </div>
                )}

                {third && (
                    <div className="third-place">
                        <div>🥉</div>
                        <h3>{third.firstName} {third.lastName}</h3>
                        <p>☕: {third.coffee}, 🥤: {third.soda}</p>
                    </div>
                )}
            </div>

            <div className="rest">
                {rest.map((user, index) => (
                    <div key={index} className="others">
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
