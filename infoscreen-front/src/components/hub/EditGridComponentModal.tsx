// src/components/EditGridComponentModal.tsx

import React, { useState, ChangeEvent, MouseEvent } from 'react';
import Modal from "./modal";

interface EditGridComponentModalProps {
    index: number | null; // Allow index to be null
    onClose: (event: MouseEvent) => void;
    updateGridComponents: (index: number, newComponent: string) => void;
    
    
}
const EditGridComponentModal: React.FC<EditGridComponentModalProps> = ({ index, onClose, updateGridComponents }) => {
    const [selectedComponent, setSelectedComponent] = useState('');

    const handleSave = (e: MouseEvent) => {
        if (index !== null) { // Make sure index is not null before updating
            updateGridComponents(index, selectedComponent);
        }
        onClose(e);
    };
    
    
    
    return (
        <Modal onClose={onClose}>
            <h2>Edit Component</h2>
            <select value={selectedComponent} onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedComponent(e.target.value)}>
                <option value="">--Select a Component--</option>
                <option value="Event">Event</option>
                <option value="Temperature">Temperature</option>
                <option value="NewsFeed">NewsFeed</option>
            </select>
            <button onClick={handleSave}>Save</button>
        </Modal>
        );
};

export default EditGridComponentModal;
