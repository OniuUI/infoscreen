// src/components/AdminForm.tsx
import React, { useState } from "react";

const AdminForm: React.FC = () => {
 const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newUser = {
      firstName,
      lastName,
      birthdate,
      imageUrl,
    };

    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        alert("User added successfully");
        setFirstName("");
        setLastName("");
        setBirthdate("");
        setImageUrl("");
      } else {
        alert("Error adding user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Error adding user");
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
