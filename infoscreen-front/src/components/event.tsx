import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from "../apiConfig"; // Import the API_BASE_URL
import NoEvents from './img/noevents.svg'; // Import your SVG image

interface EventInterface {
  _id: string;
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
        data = data.map((event: EventInterface) => ({
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
    const intervalId = setInterval(fetchEvents, 30000); // Fetch every 30 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  return (
    <div className={'event-container'}>
      {events.length > 0 ?
        events.map((event) => {
          const daysToEventText = event.daysToEvent === 0 ? 'Today' : `Days to event: ${event.daysToEvent}`;
          return (
            <div key={event._id} className={"event"}>
              <h3>{event.eventName}</h3>
              <div className="event-details">
                <p>Date: {event.eventDate}</p>
                <p>{daysToEventText}</p>
              </div>
            </div>
            );
        })
        :
        <img src={NoEvents} alt="No events" className="no-events-img" />
      }
    </div>
    );
};

export default Event;
