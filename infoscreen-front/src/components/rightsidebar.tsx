// src/components/LeftSidebar.tsx
import React, { useState, useEffect } from "react";
import Person from "./person";
import {apiService} from "./api/apiservice";
import DeparturesDisplay from "./ruter/ruter"; // Import the API_BASE_URL



const RightSidebar: React.FC = () => {


    return (
        <div className="right-sidebar">
            <DeparturesDisplay />
        </div>
    );
};

export default RightSidebar;
