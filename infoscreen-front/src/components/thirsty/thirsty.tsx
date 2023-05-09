import React, { useState, useEffect } from 'react';
import Person from '../person';
import { API_BASE_URL } from "../../apiConfig"; // Import the API_BASE_URL
import thirstylogo from '../img/thirsty.svg';

const Thirsty: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users`);
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUsers();
  }, []);

  const updateThirst = (userId: string, type: 'coffee' | 'soda', action: 'add' | 'subtract') => {
      const userIndex = users.findIndex((user) => user.id === userId);
      const updatedUsers = [...users];
      if (action === 'add') {
          updatedUsers[userIndex][type]++;
      } else {
          updatedUsers[userIndex][type] = Math.max(0, updatedUsers[userIndex][type] - 1);
      }
      setUsers(updatedUsers);
      handleUpdateUser(userId, updatedUsers[userIndex].coffee, updatedUsers[userIndex].soda);
  };
  
 const handleUpdateUser = async (userId: string, coffee: number, soda: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/coffee-soda`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ coffee, soda }),
    });

    if (!response.ok) {
      console.error('Error updating user data:', response.statusText);
    }
  } catch (error) {
    console.error('Error updating user data:', error);
  }
};
 

 // ...other code

  return (
    <div className="thirsty">
      <div className="thirsty-masthead">
        <img src={thirstylogo} alt="Thirsty" />
      </div>
      {users.map((user) => (
        <div className="user-card" key={user.id}>
          <Person {...user} />
          <div className="user-actions">
            <div>
              <p>Coffee: {user.coffee}</p>
              <button onClick={() => updateThirst(user.id, 'coffee', 'add')}>Add Coffee</button>
              <button onClick={() => updateThirst(user.id, 'coffee', 'subtract')}>Subtract Coffee</button>
            </div>
            <div>
              <p>Soda: {user.soda}</p>
              <button onClick={() => updateThirst(user.id, 'soda', 'add')}>Add Soda</button>
              <button onClick={() => updateThirst(user.id, 'soda', 'subtract')}>Subtract Soda</button>
            </div>
          </div>
        </div>
        ))}
    </div>
    );

  // ...other code

};

export default Thirsty;
