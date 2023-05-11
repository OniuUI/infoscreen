import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { API_BASE_URL } from "../../apiConfig"; // Import the API_BASE_URL

interface User {
  id: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  imageUrl: string;
}

const AdminForm: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleUserChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = event.target.value;
    const user = users.find((user) => user.id === userId);
    if (user) {
      setSelectedUser(user);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setBirthdate(user.birthdate);
      setImageUrl(user.imageUrl);
    } else {
      setSelectedUser(null);
      setFirstName("");
      setLastName("");
      setBirthdate("");
      setImageUrl("");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const user = {
      id: selectedUser ? selectedUser.id : uuidv4(), // Use the selected user's ID or generate a new one
      firstName,
      lastName,
      birthdate,
      imageUrl,
      coffee: 0,
      soda: 0,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/users${selectedUser ? `/${selectedUser.id}` : ''}`, {
        method: selectedUser ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      if (data.success) {
        alert(selectedUser ? "User updated successfully!" : "User added successfully!");
        fetchUsers();
      } else {
        alert("Failed to update user. Please try again.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      const response = await fetch(`${API_BASE_URL}/users/${selectedUser.id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        alert("User deleted successfully!");
        setUsers(users.filter(user => user.id !== selectedUser.id));
        setSelectedUser(null);
      } else {
        alert("Failed to delete user. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h1>{selectedUser ? "Edit User" : "Add User"}</h1>
      <form onSubmit={handleSubmit} className="admin-form">
        <label>
          Select User:
          <select onChange={handleUserChange} value={selectedUser?.id || ""}>
            <option value="">New User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
              ))}
          </select>
        </label>
        <label>
          First Name:
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="form-input"
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="form-input"
          />
        </label>
        <label>
          Birthdate:
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
            className="form-input"
          />
        </label>
        <label>
          Image URL:
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
            className="form-input"
          />
        </label>
        <button type="submit" className="form-button">{selectedUser ? "Update User" : "Add User"}</button>
        {selectedUser && <button type="button" onClick={handleDelete} className="form-button-delete">Delete User</button>}
      </form>
    </div>
    );
};

export default AdminForm;

