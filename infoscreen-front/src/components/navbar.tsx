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

    // Find the index of the current date in the dates array
    const currentDateIndex = datesInCurrentMonth.findIndex(date => date.getDate() === currentDate.getDate());

    return (
        <header className="flex flex-row justify-between items-center p-4 bg-blue-500">
            <div className="flex flex-row items-center space-x-4">
                {/* other nav items here */}
            </div>
            {/* Display the current day's name once at the end */}
            <div className="text-white">
                <span className="uppercase">{currentDayName}</span>
            </div>
            <div className="flex flex-row space-x-2 p-2 rounded">
                {datesInCurrentMonth.map((date, index) => (
                    <span
                        key={index}
                        className={`p-1 rounded-full text-center ${date.getDate() === currentDate.getDate() ? 'text-9xl bg-blue-700 text-white' : 'text-blue-200'}`}
                        style={{ fontSize: `${index === currentDateIndex ? '28px' : index === currentDateIndex - 1 || index === currentDateIndex + 1 ? '24px' : '20px'}` }}
                    >
                        {date.getDate()}
                    </span>
                ))}
            </div>
            {/* Display the current month once at the beginning */}
            <div className="text-white">
                <span className="uppercase">{currentMonth}</span>
            </div>
            <div className="flex items-center">
                <img src={logo} alt="Logo" className="h-8 w-auto" />
            </div>
        </header>
    );
};

export default NavBar;