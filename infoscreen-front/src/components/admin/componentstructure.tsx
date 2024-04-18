import React, { useState, useEffect } from 'react';
import { apiService } from '../api/apiservice';

interface ComponentInterface {
    _id: {
        $oid: string;
    };
    org: string;
    componentName: string;
    component: string;
}

const SetComponentStructure = () => {
    const [org, setOrg] = useState('');
    const [viewType, setViewType] = useState<number>(1);
    const [components, setComponents] = useState<string[]>(Array(viewType).fill(''));
    const [availableComponents, setAvailableComponents] = useState<ComponentInterface[]>([]);

    useEffect(() => {
        setComponents(Array(viewType).fill('')); // Reset components when viewType changes
    }, [viewType]);

    useEffect(() => {
        const fetchAvailableComponents = async () => {
            try {
                let data = await apiService.get('/components/availableComponents'); // replace with your actual API endpoint
                data = data.map((component: any) => ({
                    ...component,
                    // Add any additional properties or transformations here
                }));
                // Sort the data if needed
                // data.sort((a: ComponentInterface, b: ComponentInterface) => /* sorting logic */);
                setAvailableComponents(data);
            } catch (error) {
                console.error("Unable to fetch available system components.", error);
            }
        };
        fetchAvailableComponents();
        const intervalId = setInterval(fetchAvailableComponents, 30000); // Fetch every 30 seconds
        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, []);

    const handleComponentChange = (index: number, value: string) => {
        const newComponents = [...components];
        newComponents[index] = value;
        setComponents(newComponents);
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        const structure = {
            id: Math.floor(Math.random() * 90000000) + 10000000,
            org,
            viewType,
            components
        };

        try {
            await apiService.post('/components/structure', structure); // Updated API endpoint
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
                            {availableComponents && availableComponents.map((availableComponent, i) => (
                                <option key={i} value={availableComponent.componentName}>{availableComponent.componentName}</option>
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