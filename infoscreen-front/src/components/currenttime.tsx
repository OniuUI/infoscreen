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

  const formattedTime = time.toLocaleTimeString();

  return <span className="current-time">{formattedTime}</span>;
};

export default CurrentTime;
