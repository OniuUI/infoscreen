// src/components/LeftSidebar.tsx
import React, { useState, useEffect } from "react";
import Person from "./person";

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
        const response = await fetch("http://localhost:3001/users");
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
