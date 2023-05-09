// src/components/Admin.tsx
import React from 'react';
import AdminForm from "./adminform";
import EventForm from "./eventform";

const Admin: React.FC = () => {
    return (
        <div className="admin-page">
            <h1>Admin Page</h1>
            <AdminForm/>
            <EventForm/>
        </div>
        );
};

export default Admin;
