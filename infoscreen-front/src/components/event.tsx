// src/components/Event.tsx
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from "../apiConfig"; // Import the API_BASE_URL

interface EventInterface {
  eventName: string;
  eventDate: string;
  daysToEvent?: number;
}

const calculateDaysToEvent = (eventDate: string) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const targetDate = new Date(eventDate);
  targetDate.setHours(0, 0, 0, 0);
  const diffInMilliseconds = targetDate.getTime() - currentDate.getTime();
  return Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
};

const Event: React.FC = () => {
  const [events, setEvents] = useState<EventInterface[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/events`);
        let data = await response.json();

        // Add daysToEvent to each event
        data = data.events.map((event: EventInterface) => ({
          ...event,
          daysToEvent: calculateDaysToEvent(event.eventDate),
        }));

        // Now sort the events based on daysToEvent
        data.sort((a: EventInterface, b: EventInterface) => (a.daysToEvent || 0) - (b.daysToEvent || 0));

        setEvents(data);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className={'event-container'}>
      {events.map((event, index) => {
        const daysToEventText = event.daysToEvent;
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
