import React, { useState } from 'react';
import Modal from './modal';

interface SettingsModalProps {
    onClose: () => void;
    isDraggable: boolean;
    isResizable: boolean;
    toggleDraggable: () => void;
    toggleResizable: () => void;
    gridLength: number;  // the current grid length
    setGridLength: (length: number) => void;  // function to set the grid length
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, isDraggable, isResizable, toggleDraggable, toggleResizable, gridLength, setGridLength }) => {
    const [inputValue, setInputValue] = useState(gridLength);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(Number(event.target.value));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setGridLength(inputValue);
        onClose(); // close the modal after submit
    };

    return (
        <Modal onClose={onClose}>
            <h2>Settings</h2>
            <label>
                <input type="checkbox" checked={isDraggable} onChange={toggleDraggable} />
                Enable dragging
            </label>
            <label>
                <input type="checkbox" checked={isResizable} onChange={toggleResizable} />
                Enable resizing
            </label>
            <form onSubmit={handleSubmit}>
                <label>
                    Grid Length: 
                    <input type="number" value={inputValue} onChange={handleChange} />
                </label>
                <button type="submit">Change Grid Length</button>
            </form>
        </Modal>
        );
};

export default SettingsModal;
