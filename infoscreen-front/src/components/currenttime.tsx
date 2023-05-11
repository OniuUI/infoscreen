// src/components/CurrentTime.tsx
import React, { useState, useEffect } from 'react';

const CurrentTime: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second:'2-digit', hour12: false });
  const formattedDay = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(time);

  return (
    <div className="current-time-container">
      <span className="current-day">{formattedDay.toUpperCase()}</span>
      <span className="current-time">{formattedTime}</span>
    </div>
    );
};

export default CurrentTime;
