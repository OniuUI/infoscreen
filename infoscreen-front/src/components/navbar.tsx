import React from 'react';
import logo from './img/logowhitetext.png';
import { getDatesInCurrentMonth } from './utils/dateutils';

const NavBar: React.FC = () => {
    const currentDate = new Date();
    const datesInCurrentMonth = getDatesInCurrentMonth();

    // Formatter for month and day names
    const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long' });
    const weekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' });

    // Get current month and day names
    const currentMonth = monthFormatter.format(currentDate);
    const currentDayName = weekdayFormatter.format(currentDate);

    return (
        <header>
            <div className="nav-items">
                {/* other nav items here */}
            </div>
            {/* Display the current day's name once at the end */}
            <div className="current-day-white">
                <span>{currentDayName.toUpperCase()}</span>
            </div>
            <div className="dates-container">
                {datesInCurrentMonth.map((date, index) => (
                    <span
                        key={index}
                        className={`date-item${date.getDate() === currentDate.getDate() ? ' active' : ''}`}
                    >
                        {date.getDate()}
                    </span>
                ))}
            </div>
            {/* Display the current month once at the beginning */}
            <div className="current-month-white">
                <span>{currentMonth.toUpperCase()}</span>
            </div>
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
            </div>
        </header>
    );
};

export default NavBar;
