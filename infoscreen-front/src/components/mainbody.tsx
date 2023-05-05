// src/components/Container.tsx
import React from 'react';
import NavBar from './navbar';
import LeftSidebar from './leftsidebar';
import SquareField from './squarefield';
import '../components/css/style.css';
const Container: React.FC = () => {
    return (
        <div className="container">
            <NavBar />
            <div className="content">
                <LeftSidebar />
                <main>
                    <div className="grid">
                        <SquareField>
                            {/* Add your content for the first square field */}
                        </SquareField>
                        <SquareField>
                            {/* Add your content for the second square field */}
                        </SquareField>
                        <SquareField>
                            {/* Add your content for the third square field */}
                        </SquareField>
                        <SquareField>
                            {/* Add your content for the fourth square field */}
                        </SquareField>
                    </div>
                </main>
            </div>
        </div>
        );
};

export default Container;
