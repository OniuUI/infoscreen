import React, { useState } from 'react';

interface User {
    id: string;
    name: string;
}

interface CardProps {
    users: User[];
    task: string;
    manager: string;
    subject: string;
    dueBy: string;
}

const Card: React.FC<CardProps> = ({ users, task, manager, subject, dueBy }) => {
    const [selectedUser, setSelectedUser] = useState<string>('');

    const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUser(event.target.value);
    };

    return (
        <div className="card">
            <h3>{subject}</h3>
            <p>{task}</p>
            <p>Manager: {manager}</p>
            <label>
                Assigned to:
                <select value={selectedUser} onChange={handleUserChange}>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Due by:
                <input type="date" defaultValue={dueBy} />
            </label>
        </div>
    );
};

export default Card;