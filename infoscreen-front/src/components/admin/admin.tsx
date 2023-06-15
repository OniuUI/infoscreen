// src/components/Admin.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminForm from "./adminform";
import EventForm from "./eventform";
import ImageForm from "./imageform";
import RSSFeedForm from "./rssfeedform";

const Admin: React.FC = () => {
    const navigate = useNavigate();



    useEffect(() => {
        const refreshoken = localStorage.getItem('accessToken');
        if (!refreshoken) {
            navigate('/login'); // Redirect to /login if accessToken is not available
        }
    }, [navigate]);


    return (
        <div className="admin-page">
            <h1>Admin Page</h1>
            <AdminForm/>
            <EventForm/>
            <ImageForm/>
            <RSSFeedForm/>
        </div>
        );
};

export default Admin;
