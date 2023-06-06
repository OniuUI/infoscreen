// src/components/LeftSidebar.tsx
import React from 'react';
import logo from './img/logowhitetext.png';
import { getDatesInCurrentMonth } from './utils/dateutils';


const NavBar: React.FC = () => {
    const currentDate = new Date();
    const datesInCurrentMonth = getDatesInCurrentMonth();
    return (
        <header>
      <div className="nav-items">

      </div>
            <div className="dates-container">
                {datesInCurrentMonth.map((date, index) => (
                    <span
                        key={index}
                        className={`date-item${date.getDate() === currentDate.getDate() && date.getMonth() === currentDate.getMonth() ? ' active' : ''}`}
                        >
                        {date.getDate()}
                    </span>
                    ))}
            </div>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
        </header>
        );
};

export default NavBar;
