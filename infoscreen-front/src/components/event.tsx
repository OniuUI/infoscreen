// src/components/Event.tsx
import React, { useState, useEffect } from 'react';

interface EventInterface {
  eventName: string;
  eventDate: string;
  daysToEvent: number;
}

const calculateDaysToEvent = (eventDate: string) => {
  const currentDate = new Date();
  const targetDate = new Date(eventDate);
  const diffInMilliseconds = targetDate.getTime() - currentDate.getTime();
  return Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
};

const Event: React.FC = () => {
  const [events, setEvents] = useState<EventInterface[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3001/events');
        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      {events.map((event, index) => {
        const daysToEvent = calculateDaysToEvent(event.eventDate);
        const daysToEventText = daysToEvent === 0 ? 'Today' : `Days to event: ${daysToEvent}`;
        return (
          <div key={index}>
            <h3>{event.eventName}</h3>
            <p>Date: {event.eventDate}</p>
            <p>{daysToEventText}</p>
          </div>
        );
      })}
    </div>
    );
};

export default Event;
