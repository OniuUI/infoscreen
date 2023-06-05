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

const Container: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const refreshoken = localStorage.getItem('refreshToken');
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
                                <Temperature />
                                <NewsFeed />
                            </Carousel>
                        </SquareField>
                        <SquareField>
                            <ThirstyLeaderboard />
                        </SquareField>
                    </div>
                </main>
            </div>
        </div>
        );
};

export default Container;
