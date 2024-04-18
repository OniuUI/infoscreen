import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './navbar';
import LeftSidebar from './leftsidebar';
import SquareField from './squarefield';
import '../components/css/style.css';
import CurrentTime from './currenttime';
import Temperature from './temperature';
import Event from './event';
import ThirstyLeaderboard from "./thirstyleaderboard";
import Carousel from './carousel';
import NewsFeed from "./newsfeed";
import Gallery from "./gallery";
import DeparturesDisplay from "./ruter/ruter";
import RightSidebar from "./rightsidebar";
import {apiService} from "./api/apiservice";
import Kaizen from "./kaizen";

interface ComponentInterface {
    _id: {
        $oid: string;
    };
    id: string;
    org: string;
    componentName: string;
    component: string;
    active: boolean;
}

const componentMapping: { [key: string]: React.FC<any> } = {
    'CurrentTime': CurrentTime,
    'Temperature': Temperature,
    'Event': Event,
    'ThirstyLeaderboard': ThirstyLeaderboard,
    'Carousel': Carousel,
    'NewsFeed': NewsFeed,
    'Gallery': Gallery,
    'DeparturesDisplay': DeparturesDisplay,
    "Kaizen": Kaizen
};

const Container: React.FC = () => {
    const navigate = useNavigate();
    const [components, setComponents] = useState<string[]>([]);
    const [activeStructureId, setActiveStructureId] = useState<string | null>(null); // Add this line

    useEffect(() => {
        const refreshoken = localStorage.getItem('accessToken');
        if (!refreshoken) {
            navigate('/login'); // Redirect to /login if accessToken is not available
        }
    }, [navigate]);

    useEffect(() => {
        const fetchComponents = async () => {
            try {
                // Fetch all structures
                let data = await apiService.get(`/components/componentStructures`);
                data = data.map((structure: any) => ({
                    ...structure,
                    // Add any additional properties or transformations here
                }));

                // Find the active structure
                const activeStructure = data.find((structure: ComponentInterface) => structure.active);

                // If an active structure is found and it's different from the current one, set the components state with its components
                if (activeStructure && activeStructure.id !== activeStructureId) { // Modify this line
                    setComponents(activeStructure.components);
                    setActiveStructureId(activeStructure.id); // Add this line
                }
            } catch (error) {
                console.error("Unable to fetch component structures.", error);
            }
        }

        // Call fetchComponents immediately
        fetchComponents();

        // Then set up an interval to call fetchComponents every minute
        const intervalId = setInterval(fetchComponents, 25 * 1000);

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [components, activeStructureId]); // Modify this line

    useEffect(() => {
        const intervalId = setInterval(() => {
            window.location.reload();
        }, 4 * 60 * 60 * 1000); // 4 hours

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="container">
            <NavBar />
            <div className="content">
                <LeftSidebar />
                <main>
                    <div className="grid">
                        {components.map((componentName, index) => {
                            const Component = componentMapping[componentName];
                            return (
                                <SquareField key={index}>
                                    <Component />
                                </SquareField>
                            );
                        })}
                    </div>
                </main>
                <RightSidebar />
            </div>
        </div>
    );
};

export default Container;