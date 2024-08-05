// src/components/Admin.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import { Link as ScrollLink, Element } from 'react-scroll';
import AdminForm from "./adminform";
import EventForm from "./eventform";
import ImageForm from "./imageform";
import RSSFeedForm from "./rssfeedform";
import Componentstructure from "./componentstructure";
import Activecomponentstructure from "./activecomponentstructure";

const Admin: React.FC = () => {
    const navigate = useNavigate();
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
    const animation = useSpring({
        from: { boxShadow: '0px 0px 0px 0px rgba(0,255,0,0.3)' },
        to: { boxShadow: selectedComponent ? '0px 0px 10px 3px rgba(0,255,0,0.3)' : '0px 0px 0px 0px rgba(0,255,0,0.3)' },
        config: { duration: 2000 },
        reset: true
    });

    useEffect(() => {
        const refreshoken = localStorage.getItem('accessToken');
        if (!refreshoken) {
            navigate('/login'); // Redirect to /login if accessToken is not available
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow p-4">
                <div className="bg-red-600 text-white p-4 mb-4">
                    Eye-share Adminpage.
                </div>
            </header>
            <div className="flex">
                <nav className="w-64 bg-gray-200 p-4">
                    <ul className="space-y-2">
                        <li className="p-2 rounded hover:bg-gray-300"><ScrollLink to="userManager" smooth={true} duration={500} onClick={() => setSelectedComponent('userManager')}>User Manager</ScrollLink></li>
                        <li className="p-2 rounded hover:bg-gray-300"><ScrollLink to="eventManager" smooth={true} duration={500} onClick={() => setSelectedComponent('eventManager')}>Event Manager</ScrollLink></li>
                        <li className="p-2 rounded hover:bg-gray-300"><ScrollLink to="galleryManager" smooth={true} duration={500} onClick={() => setSelectedComponent('galleryManager')}>Gallery Manager</ScrollLink></li>
                        <li className="p-2 rounded hover:bg-gray-300"><ScrollLink to="rssManager" smooth={true} duration={500} onClick={() => setSelectedComponent('rssManager')}>RSS and Newsfeed Manager</ScrollLink></li>
                        <li className="p-2 rounded hover:bg-gray-300"><ScrollLink to="structureTool" smooth={true} duration={500} onClick={() => setSelectedComponent('structureTool')}>Infoscreen Component Structure Creation Tool</ScrollLink></li>
                        <li className="p-2 rounded hover:bg-gray-300"><ScrollLink to="structureSelector" smooth={true} duration={500} onClick={() => setSelectedComponent('structureSelector')}>Active Component Structure Selector</ScrollLink></li>
                    </ul>
                </nav>
                <main className="flex-grow p-4 grid grid-cols-2 gap-4">
                    <Element name="userManager">
                        <animated.div style={selectedComponent === 'userManager' ? animation : {}}><AdminForm/></animated.div> {/* User manager */}
                    </Element>
                    <Element name="eventManager">
                        <animated.div style={selectedComponent === 'eventManager' ? animation : {}}><EventForm/></animated.div> {/* Event manager */}
                    </Element>
                    <Element name="galleryManager">
                        <animated.div style={selectedComponent === 'galleryManager' ? animation : {}}><ImageForm/></animated.div> {/* Gallery manager */}
                    </Element>
                    <Element name="rssManager">
                        <animated.div style={selectedComponent === 'rssManager' ? animation : {}}><RSSFeedForm/></animated.div> {/* RSS and newsfeed manager */}
                    </Element>
                    <Element name="structureTool">
                        <animated.div style={selectedComponent === 'structureTool' ? animation : {}}><Componentstructure/></animated.div> {/* Infoscreen component structure creation tool */}
                    </Element>
                    <Element name="structureSelector">
                        <animated.div style={selectedComponent === 'structureSelector' ? animation : {}}><Activecomponentstructure/></animated.div> {/* Active component structure selector */}
                    </Element>
                </main>
            </div>
            <footer className="bg-white shadow p-4">
                {/* Footer content goes here */}
            </footer>
        </div>
    );
};

export default Admin;