import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import SquareField from "../squarefield";
import './css/modal.css';
import EditGridComponentModal from './EditGridComponentModal';
import SettingsModal from './settingsmodal'; // Import the SettingsModal component
import { apiService } from '../api/apiservice';
import { componentsList } from './componentsList';  // import componentsList

// Load components from componentsList
const components: {[key: string]: React.FC<any>} = componentsList;

const ResponsiveGridLayout = WidthProvider(Responsive);

const Hub: React.FC = () => {
    const navigate = useNavigate();
    const [gridComponents, setGridComponents] = useState<Array<string>>([]);
    const [gridLength, setGridLength] = useState<number>(2); // default grid length
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isDraggable, setIsDraggable] = useState<boolean>(true); // default draggable state
    const [isResizable, setIsResizable] = useState<boolean>(true); // default resizable state
    const [showSettings, setShowSettings] = useState(false); // control SettingsModal visibility
    const [preferencesLoaded, setPreferencesLoaded] = useState(false);

    const userId = localStorage.getItem("userIdent");

    const updateGridComponents = (index: number, newComponent: string) => {
        let newGridComponents = [...gridComponents];
        if(index !== null) {
            newGridComponents[index] = newComponent;
        } else {
            newGridComponents.push(newComponent);
        }
        setGridComponents(newGridComponents);
    };

    const handleOpenModal = (index: number | null = null) => {
        setEditingIndex(index);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingIndex(null);
    };

    const handleOpenSettings = () => {
        setShowSettings(true);
    };

    const handleCloseSettings = () => {
        setShowSettings(false);
    };

    useEffect(() => {
        // Add new empty components if gridLength is increased
        if (gridComponents.length < gridLength) {
            const newGridComponents = [...gridComponents, ...Array(gridLength - gridComponents.length).fill('')];
            setGridComponents(newGridComponents);
        }
    // Remove extra components if gridLength is decreased
    else if (gridComponents.length > gridLength) {
        const newGridComponents = gridComponents.slice(0, gridLength);
        setGridComponents(newGridComponents);
    }
    }, [gridLength, gridComponents]);


    useEffect(() => {
        (async () => {
            const preferences = await apiService.get(`/hub/${userId}/preferences`);
            const {gridLength, gridComponents, isDraggable, isResizable} = preferences;
            setGridLength(gridLength);
            setGridComponents(gridComponents);
            setIsDraggable(isDraggable);
            setIsResizable(isResizable);
            setPreferencesLoaded(true);
        })();
    }, [userId]);

    useEffect(() => {
        if (!preferencesLoaded) return;
        (async () => {
            await apiService.post(`/hub/${userId}/preferences`, {
                gridLength,
                gridComponents,
                isDraggable,
                isResizable
            });
        })();
    }, [gridLength, gridComponents, userId, preferencesLoaded, isDraggable, isResizable]);

    useEffect(() => {
        const refreshToken = localStorage.getItem('accessToken');
        if (!refreshToken) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            window.location.reload();
        }, 4 * 60 * 60 * 1000); // 4 hours
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="container">
            <div className="header">
                <h1>My Green Facebook</h1>
                <button onClick={() => handleOpenModal()}>Add component</button>
                <button onClick={handleOpenSettings}>Settings</button>
            </div>
            <div className="main-content">
                <div className="sidebar">
                    {/* You can place your desired content for the left sidebar here */}
                </div>
                <div className="feed">
                    <ResponsiveGridLayout
                        className="layout"
                        cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
                        isDraggable={isDraggable}
                        isResizable={isResizable}
                    >
                        {gridComponents.map((component, i) => (
                            <div key={i} data-grid={{x: i % 6, y: Math.floor(i / 6), w: 2, h: 2}}>
                                <SquareField>
                                    {component && React.createElement(components[component])}
                                    <button onClick={() => handleOpenModal(i)}>Edit</button>
                                </SquareField>
                            </div>
                        ))}
                    </ResponsiveGridLayout>
                </div>
                <div className="rightbar">
                    {/* You can place your desired content for the right sidebar here */}
                </div>
            </div>
            {showModal && (
                <EditGridComponentModal
                    index={editingIndex}
                    onClose={handleCloseModal}
                    updateGridComponents={updateGridComponents}
                />
            )}
            {showSettings && (
                <SettingsModal
                    onClose={handleCloseSettings}
                    isDraggable={isDraggable}
                    isResizable={isResizable}
                    toggleDraggable={() => setIsDraggable(!isDraggable)}
                    toggleResizable={() => setIsResizable(!isResizable)}
                    gridLength={gridLength}
                    setGridLength={setGridLength}
                />
            )}
        </div>
    );
};

export default Hub;