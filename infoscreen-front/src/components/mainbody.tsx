import React, { useEffect } from 'react';
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

const Container: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const refreshoken = localStorage.getItem('accessToken');
        if (!refreshoken) {
            navigate('/login'); // Redirect to /login if accessToken is not available
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
            <NavBar />
            <div className="content">
                <LeftSidebar />
                <main>
                    <div className="grid">
                        <SquareField>
                            <Carousel interval={420000}>
                                <Gallery />
                                <Event />
                            </Carousel>
                        </SquareField>
                        <SquareField>
                            <CurrentTime />
                        </SquareField>
                        <SquareField>
                            <Carousel interval={420000}>
                                <NewsFeed />
                                <Temperature />
                            </Carousel>
                        </SquareField>
                        <SquareField>
                            <ThirstyLeaderboard />
                        </SquareField>
                    </div>
                </main>
                <RightSidebar />
            </div>
        </div>
        );
};

export default Container;
