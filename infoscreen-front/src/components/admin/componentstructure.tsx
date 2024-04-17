import React, { useState, useEffect } from 'react';
import { apiService } from '../api/apiservice';

const SetComponentStructure = () => {
    const [org, setOrg] = useState('');
    const [viewType, setViewType] = useState<number>(1);
    const [components, setComponents] = useState<string[]>(Array(viewType).fill(''));
    const [availableComponents, setAvailableComponents] = useState<string[]>([]);

    useEffect(() => {
        setComponents(Array(viewType).fill('')); // Reset components when viewType changes
    }, [viewType]);

    useEffect(() => {
        const fetchAvailableComponents = async () => {
            try {
                const response = await apiService.get('/components');
                setAvailableComponents(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAvailableComponents();
    }, []);

    const handleComponentChange = (index: number, value: string) => {
        const newComponents = [...components];
        newComponents[index] = value;
        setComponents(newComponents);
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        const structure = {
            _id: '1', // This should be generated or inputted by the user
            org,
            viewType,
            components
        };

        try {
            await apiService.post('/structure', structure);
            alert('Component structure set successfully');
        } catch (error) {
            console.error('Error setting component structure', error);
        }
    };

    return (
        <div className="form-container">
            <h1>Set Component Structure</h1>
            <form onSubmit={handleSubmit} className="admin-form">
                <label>
                    Organization:
                    <input type="text" value={org} onChange={e => setOrg(e.target.value)} className="form-input" />
                </label>
                <label>
                    View Type:
                    <input type="number" value={viewType} onChange={e => setViewType(Number(e.target.value))} className="form-input" />
                </label>
                {components.map((component, index) => (
                    <label key={index}>
                        Component {index + 1}:
                        <select value={component} onChange={e => handleComponentChange(index, e.target.value)} className="form-input">
                            <option value="">Select a component</option>
                            {availableComponents.map((availableComponent, i) => (
                                <option key={i} value={availableComponent}>{availableComponent}</option>
                            ))}
                        </select>
                    </label>
                ))}
                <button type="submit" className="form-button">Set Component Structure</button>
            </form>
        </div>
    );
};

export default SetComponentStructure;