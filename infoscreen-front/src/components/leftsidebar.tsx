// src/components/LeftSidebar.tsx
import React, { useState, useEffect } from "react";
import Person from "./person";
import { API_BASE_URL } from "../apiConfig"; // Import the API_BASE_URL

interface User {
  firstName: string;
  lastName: string;
  birthdate: string;
  imageUrl: string;
  daysToBirthday?: number;
}

const calculateDaysToBirthday = (birthdate: string) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Ignore time in currentDate
  const targetDate = new Date(birthdate);

  // Set targetDate year to the current year
  targetDate.setFullYear(currentDate.getFullYear());

  // Ignore time in targetDate
  targetDate.setHours(0, 0, 0, 0);

  // If the targetDate has passed in the current year, set the year to the next
  if (targetDate < currentDate) {
    targetDate.setFullYear(currentDate.getFullYear() + 1);
  }

  const diffInMilliseconds = targetDate.getTime() - currentDate.getTime();
  return Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
};


const LeftSidebar: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users`);
        let data = await response.json();

        // Add daysToBirthday to each user
        data = data.users.map((user: User) => ({
          ...user,
          daysToBirthday: calculateDaysToBirthday(user.birthdate),
        }));

        // Now sort the users based on daysToBirthday
        data.sort((a: User, b: User) => (a.daysToBirthday || 0) - (b.daysToBirthday || 0));

        setUsers(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsers();
    const intervalId = setInterval(fetchUsers, 3600000); // Update every hour

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  return (
    <div className="left-sidebar">
      {users.map((user, index) => (
        <Person
          key={index}
          firstName={user.firstName}
          lastName={user.lastName}
          daysToBirthday={user.daysToBirthday || 0} // Pass daysToBirthday as a prop
          imageUrl={user.imageUrl}
        />
        ))}
    </div>
    );
};

export default LeftSidebar;
