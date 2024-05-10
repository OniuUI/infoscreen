import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { API_BASE_URL } from "../../apiConfig";
import {apiService} from "../api/apiservice";
import {Role} from "../utils/types";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthdate: string;
  imageUrl: string;
  password: string;
}

const AdminForm: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [email, setEmail]= useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('user');


  useEffect(() => {
    fetchUsers();
    }, []);


  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await apiService.get('/access/roles'); // Replace with your actual endpoint
        if (Array.isArray(response.roles)) {
          setRoles(response.roles);
        } else {
          console.error('Invalid roles data:', response.roles);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    fetchRoles();
  }, []);

  const handleRoleChange = async (user: User, roleId: string) => {
    try {
        const response = await apiService.put(`/users/${user._id}/roles`, {roleId}); // Replace with your actual endpoint
        if (response.success) {
        console.log('Role updated successfully');
      } else {
        console.error('Failed to update role:', response.error);
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };


  const fetchUsers = async () => {
    try {
      const data = await apiService.get(`/users`);
      if (data.users) {
        setUsers(data.users);
      } else {
        console.log("API response does not contain users property. Response:", data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };


  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  };


  const handleUserChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = event.target.value;
    const user = users.find((user) => user._id === userId);
    if (user) {
      setSelectedUser(user);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setBirthdate(user.birthdate);
      setImageUrl(user.imageUrl);
      setEmail(user.email);
      setPassword("");
    } else {
      setSelectedRole('user');
      setFirstName("");
      setLastName("");
      setBirthdate("");
      setImageUrl("");
      setEmail("");
      setPassword("");
    }
  };

  const handleRoleUpdate = async () => {
    if (!selectedUser) return;

    try {
      const data = await apiService.put(`/access/updaterole`, { userId: selectedUser._id, role: selectedRole });

      if (data.success) {
        console.log("Role updated successfully!");
      } else {
        console.error("Failed to update role:", data.error);
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleRoleDelete = async () => {
    if (!selectedUser) return;

    try {
      const data = await apiService.delete(`/access/deleterole/${selectedUser._id}`);

      if (data.success) {
        console.log("Role deleted successfully!");
      } else {
        console.error("Failed to delete role:", data.error);
      }
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const user = {
      _id: selectedUser ? selectedUser._id : uuidv4(),
      firstName,
      lastName,
      email,
      birthdate,
      imageUrl,
      password,
      coffee: 0,
      soda: 0,
    };

    try {
      const userData = await apiService[selectedUser ? "put" : "post"](`/users${selectedUser ? `/${selectedUser._id}` : ''}`, user);

      if (userData.success) {
        alert(selectedUser ? "User updated successfully!" : "User added successfully!");

        // If a new user was created, update the selected user
        if (!selectedUser) {
          setSelectedUser(user);
        }

        // Make an API call to create the role for the user
        const createRoleData = await apiService.post('/access/createrole', { userId: user._id, role: selectedRole });
        console.log("UserId: ", user._id);
        if (createRoleData.success) {
          console.log('Role created successfully');
        } else {
          console.error('Failed to create role:', createRoleData.error);
        }

        await fetchUsers();
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
      const data = await apiService.delete(`/users/${selectedUser._id}`);

      if (data.success) {
        alert("User deleted successfully!");
        setUsers(users.filter(user => user._id !== selectedUser._id));
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
          <select onChange={handleUserChange} value={selectedUser?._id || ""}>
            <option value="">New User</option>
            {users.map((user) => (
                <option key={user._id} value={user._id}>
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
        <label>
          Email:
          <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
              className="form-input"
          />
        </label>
        <label>
          Password:
          <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
          />
        </label>
        <button type="submit" className="form-button">{selectedUser ? "Update User" : "Add User"}</button>
        {selectedUser &&
            <button type="button" onClick={() => {
              handleRoleDelete();
              handleDelete();
            }} className="form-button-delete">Delete User</button>
        }
        <label>
          Role:
          <select value={selectedRole} onChange={(e) => {
            setSelectedRole(e.target.value);
          }}>
            {roles.map((role) => (
                <option key={role._id} value={role.name}>
                  {role.name}
                </option>
            ))}
          </select>
        </label>
      </form>
    </div>
  );
};

export default AdminForm;
