// src/components/Admin.tsx
import React from 'react';
import AdminForm from "./adminform";
import EventForm from "./eventform";
import ImageForm from "./imageform";

const Admin: React.FC = () => {
    return (
        <div className="admin-page">
            <h1>Admin Page</h1>
            <AdminForm/>
            <EventForm/>
            <ImageForm/>
        </div>
        );
};

export default Admin;
