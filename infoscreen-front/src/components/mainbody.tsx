// src/components/Container.tsx
import React from 'react';
import NavBar from './navbar';
import LeftSidebar from './leftsidebar';
import SquareField from './squarefield';
import '../components/css/style.css';
import CurrentTime from './currenttime';
import Temprature from './temprature';
import Event from './event';
import ThirstyLeaderboard from "./thirstyleaderboard";
import Carousel from './carousel';
import NewsFeed from "./newsfeed";

const Container: React.FC = () => {
    return (
        <div className="container">
            <NavBar />
            <div className="content">
                <LeftSidebar />
                <main>
                    <div className="grid">
                        <SquareField>
                             <Event />
                        </SquareField>
                        <SquareField>
                             <CurrentTime />
                        </SquareField>
                        <SquareField>
                            <Carousel interval={420000}>
                                <Temprature />
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
