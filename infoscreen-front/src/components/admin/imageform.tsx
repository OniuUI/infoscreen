import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import {apiService} from "../api/apiservice";

interface User {
    _id: string;
    firstName: string;
    lastName: string;
}

const ImageForm: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [imageName, setImageName] = useState("");
    const [base64Image, setBase64Image] = useState("");

    useEffect(() => {
        fetchUsers();
        }, []);

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

    const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const userId = event.target.value;
        const user = users.find((user) => user._id === userId);
        setSelectedUser(user || null);
    };
    

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedUser) return; // Ensure a user is selected

        const dateUploaded = new Date().toISOString();
        const imageObj = {
            userId: selectedUser._id,
            firstName: selectedUser.firstName,
            lastName: selectedUser.lastName,
            dateUploaded,
            imageName,
            base64Image,
        };

        try {
            const response = await apiService.post(`/gallery`, imageObj);

            if (response.ok) {
                alert("Image added successfully!");
            } else {
                const errorData = await response.json();
                alert(`Failed to upload image: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image. Please try again.");
        }
    };
    

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const base64WithoutPrefix = base64String.split(",")[1];
                setBase64Image(base64WithoutPrefix);
            };
        }
    };

    return (
        <div className="form-container">
            <h1>Add Image</h1>
            <form onSubmit={handleSubmit} className="event-form">
                <label>
                    Select User:
                    <select onChange={handleUserChange} value={selectedUser?._id || ""}>
                        <option value="">Select a user</option>
                        {users.map((user) => (
                            <option key={user._id} value={user._id}>
                                {user.firstName} {user.lastName}
                            </option>
                            ))}
                    </select>
                </label>
                <label>
                    Image Name:
                    <input
                        type="text"
                        value={imageName}
                        onChange={(e) => setImageName(e.target.value)}
                        required
                        className="form-input"
                    />
                </label>
                <label>
                    Select Image:
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        className="form-input"
                    />
                </label>
                <button type="submit" className="form-button">Add Image</button>
            </form>
        </div>
        );
};

export default ImageForm;
