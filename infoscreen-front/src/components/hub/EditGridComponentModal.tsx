// src/components/EditGridComponentModal.tsx

import React, { useState, ChangeEvent, MouseEvent } from 'react';
import Modal from "./modal";
import { componentsNames } from './componentsList';  // import componentsNames

interface EditGridComponentModalProps {
    index: number | null;
    onClose: (event: MouseEvent) => void;
    updateGridComponents: (index: number, newComponent: string) => void;
}

const EditGridComponentModal: React.FC<EditGridComponentModalProps> = ({ index, onClose, updateGridComponents }) => {
    const [selectedComponent, setSelectedComponent] = useState('');

    const handleSave = (e: MouseEvent) => {
        if (index !== null) {
            updateGridComponents(index, selectedComponent);
        }
        onClose(e);
    };
    
    return (
        <Modal onClose={onClose}>
            <h2>Edit Component</h2>
            <select value={selectedComponent} onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedComponent(e.target.value)}>
                <option value="">--Select a Component--</option>
                {componentsNames.map(name => <option key={name} value={name}>{name}</option>)}  // use componentsNames to generate options
            </select>
            <button onClick={handleSave}>Save</button>
        </Modal>
        );
};

export default EditGridComponentModal;
