import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SquareField from "../squarefield";
import './css/modal.css';
import CurrentTime from "../currenttime";
import Temperature from "../temperature";
import Event from "../event";
import ThirstyLeaderboard from "../thirstyleaderboard";
import Carousel from "../carousel";
import NewsFeed from "../newsfeed";
import Gallery from "../gallery";
import EditGridComponentModal from './EditGridComponentModal';
import { apiService } from '../api/apiservice';

const components: {[key: string]: React.FC<any>} = {
    CurrentTime,
    Temperature,
    Event,
    ThirstyLeaderboard,
    Carousel,
    NewsFeed,
    Gallery,
};

const Hub: React.FC = () => {
    const navigate = useNavigate();
    const [gridComponents, setGridComponents] = useState<Array<string>>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [preferencesLoaded, setPreferencesLoaded] = useState(false); // added this line

    const userId = localStorage.getItem("userIdent");

    const updateGridComponents = (index: number, newComponent: string) => {
        let newGridComponents = [...gridComponents];
        newGridComponents[index] = newComponent;
        setGridComponents(newGridComponents);
    };

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingIndex(null); // Reset editingIndex when closing the modal
    };
    
    const handleOpenEditModal = (i: number) => {
        setEditingIndex(i);
        setShowModal(true);
    };

    // Fetch user's preferences when the component mounts
    useEffect(() => {
        (async () => {
            const preferences = await apiService.get(`/hub/${userId}/preferences`);
            setGridComponents(preferences);
            setPreferencesLoaded(true); // added this line
        })();
    }, [userId]);

    // Update user's preferences whenever they change
    useEffect(() => {
        if (!preferencesLoaded) return; // added this line
        (async () => {
            await apiService.post(`/hub/${userId}/preferences`, gridComponents);
        })();
        }, [gridComponents, userId, preferencesLoaded]); // added preferencesLoaded to the dependency array

    useEffect(() => {
        // Redirect to /login if accessToken is not available
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
            <button onClick={handleOpenModal}>Add component</button>
            <div className="content">
                <main>
                    <div className="grid">
                        {Array.from({ length: 10 }, (_, i) => (
                            <SquareField key={i}>
                                {gridComponents[i] &&
                                    React.createElement(components[gridComponents[i]])}
                                <button onClick={() => handleOpenEditModal(i)}>Edit</button>
                            </SquareField>
                            ))}
                    </div>
                </main>
            </div>
            {showModal && (
                <EditGridComponentModal
                    index={editingIndex}
                    onClose={handleCloseModal}
                    updateGridComponents={updateGridComponents}
                />
                )}
        </div>
        );
};

export default Hub;
