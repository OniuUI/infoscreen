// src/components/hub/profile/profile.tsx
import React, { useEffect, useState } from 'react';
import { apiService } from "../../api/apiservice";

interface User {
    firstName: string;
    lastName: string;
    email: string;
    imageUrl: string;
    coffee: number;
    soda: number;
}

const Profile = () => {
    const [user, setUser] = useState<User>();

    useEffect(() => {
        const fetchUser = async () => {
            // Retrieve user id from local storage
            const userId = localStorage.getItem('userIdent');
            if (!userId) {
                console.error("No user id found in local storage");
                return;
            }
            try {
                // Make request to backend using user id
                const userData = await apiService.get(`/hub/${userId}/profile`);
                setUser(userData);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        fetchUser();
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{user.firstName + " " +  user.lastName}'s Profile</h1>
            <p>Email: {user.email}</p>
            {/* Display other user data here */}
        </div>
        );
};

export default Profile;
