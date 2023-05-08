// src/components/LeftSidebar.tsx
import React, { useState, useEffect } from "react";
import Person from "./person";
import { API_BASE_URL } from "../apiConfig"; // Import the API_BASE_URL

interface User {
  firstName: string;
  lastName: string;
  birthdate: string;
  imageUrl: string;
}

const LeftSidebar: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users`);
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="left-sidebar">
      {users.map((user, index) => (
        <Person
          key={index}
          firstName={user.firstName}
          lastName={user.lastName}
          birthdate={user.birthdate}
          imageUrl={user.imageUrl}
        />
        ))}
    </div>
    );
};
export default LeftSidebar;
