// src/components/Event.tsx
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from "../apiConfig"; // Import the API_BASE_URL

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
        const response = await fetch(`${API_BASE_URL}/events`);
        const data = await response.json();

        // Add sorting here
        data.events.sort((a: EventInterface, b: EventInterface) => {
          const dateA = new Date(a.eventDate);
          const dateB = new Date(b.eventDate);

          return dateA.getTime() - dateB.getTime(); // Ascending order
        });

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
          <div key={index} className={"event"}>
            <h3>{event.eventName}</h3>
            <div className="event-details">
              <p>Date: {event.eventDate}</p>
              <p>{daysToEventText}</p>
            </div>
          </div>
        );
      })}
    </div>
    );
};

export default Event;
