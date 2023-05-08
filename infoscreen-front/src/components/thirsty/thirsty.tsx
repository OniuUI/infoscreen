import React, { useState, useEffect } from 'react';
import Person from '../person';

const Thirsty: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/users');
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
    const response = await fetch(`http://localhost:3001/users/${userId}/coffee-soda`, {
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
 

  return (
      <div className="thirsty">
          {users.map((user) => (
              <div key={user.id}>
                  <Person {...user} />
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
      ))}
    </div>
    );
};

export default Thirsty;
