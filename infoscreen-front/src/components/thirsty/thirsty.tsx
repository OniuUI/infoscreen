import React, { useState, useEffect } from 'react';
import Person from '../person';

import {apiService} from "../api/apiservice";
import thirstylogo from '../img/thirsty.svg';

const Thirsty: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiService.get(`/users`);
        const users = data.users.map((user: any) => ({
          ...user,
          coffee: user.coffee || 0,
          soda: user.soda || 0,
        }));
        setUsers(users);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUsers();
    }, []);

  const updateThirst = (userId: string, type: 'coffee' | 'soda', action: 'add' | 'subtract') => {
    const userIndex = users.findIndex((user) => user._id === userId);
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
      const response = await apiService.put(`/users/${userId}/coffee-soda`, { coffee, soda });

      if (!response.ok) {
        console.error('Error updating user data:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <div className="thirsty">
      <div className="thirsty-masthead">
        <img src={thirstylogo} alt="Thirsty" />
      </div>
      {users.map((user) => (
        <div className="user-card" key={user._id}>
          <Person {...user} />
          <div className="user-actions">
            <div>
              <p>Coffee: {user.coffee}</p>
              <button onClick={() => updateThirst(user._id, 'coffee', 'add')}>Add Coffee</button>
              <button onClick={() => updateThirst(user._id, 'coffee', 'subtract')}>Subtract Coffee</button>
            </div>
            <div>
              <p>Soda: {user.soda}</p>
              <button onClick={() => updateThirst(user._id, 'soda', 'add')}>Add Soda</button>
              <button onClick={() => updateThirst(user._id, 'soda', 'subtract')}>Subtract Soda</button>
            </div>
          </div>
        </div>
        ))}
    </div>
    );


};

export default Thirsty;
