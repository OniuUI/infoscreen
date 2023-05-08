// src/components/AdminForm.tsx
import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { API_BASE_URL } from "../../apiConfig"; // Import the API_BASE_URL

const AdminForm: React.FC = () => {
 const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const newUser = {
    id: uuidv4(), // Generate a unique ID for the new user
    firstName,
    lastName,
    birthdate,
    imageUrl,
    coffee: 0,
    soda: 0,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    const data = await response.json();
    if (data.success) {
      alert("User added successfully!");
      setFirstName("");
      setLastName("");
      setBirthdate("");
      setImageUrl("");
    } else {
      alert("Failed to add user. Please try again.");
    }
  } catch (error) {
    console.error("Error adding user:", error);
    alert("Failed to add user. Please try again.");
  }
  };

  return (
    <div>
      <h1>Add User</h1>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Last Name:
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Birthdate:
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Image URL:
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Add User</button>
      </form>
    </div>
  );
};


export default AdminForm;
