import React, { useState, useEffect } from 'react';
import { apiService } from '../api/apiservice';

interface ComponentStructureInterface {
    id: number;
    org: string;
    viewType: number;
    components: string[];
    active: boolean;
}

const ActiveComponentStructure = () => {
    const [structures, setStructures] = useState<ComponentStructureInterface[]>([]);
    const [selectedStructure, setSelectedStructure] = useState<string>('');

    useEffect(() => {
        const fetchStructures = async () => {
            try {
                let data = await apiService.get('/components/componentStructures'); // replace with your actual API endpoint
                data = data.map((structure: any) => ({
                    ...structure,
                    // Add any additional properties or transformations here
                }));
                setStructures(data);
                const activeStructure = data.find((structure: ComponentStructureInterface) => structure.active);
                if (activeStructure) {
                    setSelectedStructure(activeStructure.id);
                }
            } catch (error) {
                console.error("Unable to fetch component structures.", error);
            }
        };
        fetchStructures();
        const intervalId = setInterval(fetchStructures, 30000); // Fetch every 30 seconds
        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, []);

    const handleSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newActiveStructureId = Number(event.target.value); // Convert the value to a number
        setSelectedStructure(newActiveStructureId.toString()); // Convert the value back to a string
        try {
            // Set the previously active structure to inactive
            const previousActiveStructure = structures.find(structure => structure.active);
            if (previousActiveStructure) {
                await apiService.post('/components/updateActiveStatus', { id: previousActiveStructure.id, active: false }); // Call the update endpoint
            }
            // Set the newly selected structure to active
            await apiService.post('/components/updateActiveStatus', { id: newActiveStructureId, active: true }); // Call the update endpoint
        } catch (error) {
            console.error("Unable to set active component structure.", error);
        }
    };

    return (
        <div>
            <h1>Set Active Component Structure</h1>
            <select value={selectedStructure} onChange={handleSelect}>
                <option value="">Select a structure</option>
                {structures && structures.map((structure) => (
                    <option key={structure.id} value={structure.id}>{"ID: " + structure.id + " ViewType: " + structure.viewType + " " + structure.components}</option>
                ))}
            </select>
        </div>
    );
};

export default ActiveComponentStructure;