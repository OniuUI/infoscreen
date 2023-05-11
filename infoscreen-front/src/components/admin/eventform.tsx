import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { API_BASE_URL } from "../../apiConfig";

interface Event {
  id: string;
  eventName: string;
  eventDate: string;
}

const EventForm: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      const data = await response.json();
      setEvents(data.events);
    } catch (error) {
      console.error("Error fetching events data:", error);
    }
  };

  const handleEventChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const eventId = event.target.value;
    const foundEvent = events.find((event) => event.id === eventId);
    if (foundEvent) {
      setSelectedEvent(foundEvent);
      setEventName(foundEvent.eventName);
      setEventDate(foundEvent.eventDate);
    } else {
      setSelectedEvent(null);
      setEventName("");
      setEventDate("");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const eventObj = {
      id: selectedEvent ? selectedEvent.id : uuidv4(),
      eventName,
      eventDate,
    };

    try {
      await fetch(`${API_BASE_URL}/events${selectedEvent ? `/${selectedEvent.id}` : ''}`, {
        method: selectedEvent ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventObj),
      });
      alert(selectedEvent ? "Event updated successfully!" : "Event added successfully!");
      fetchEvents();
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (selectedEvent) {
      try {
        await fetch(`${API_BASE_URL}/events/${selectedEvent.id}`, {
          method: "DELETE",
        });
        alert("Event deleted successfully!");
        setEvents(events.filter(event => event.id !== selectedEvent.id));
        setSelectedEvent(null);
        setEventName("");
        setEventDate("");
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event. Please try again.");
      }
    }
  };

  return (
    <div className="form-container">
      <h1>{selectedEvent ? "Edit Event" : "Add Event"}</h1>
      <form onSubmit={handleSubmit} className="event-form">
        <label>
          Select Event:
          <select onChange={handleEventChange} value={selectedEvent?.id || ""}>
            <option value="">New Event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.eventName} - {new Date(event.eventDate).toLocaleDateString()}
              </option>
              ))}
          </select>
        </label>
        <label>
          Event Name:
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
            className="form-input"
          />
        </label>
        <label>
          Event Date:
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
            className="form-input"
          />
        </label>
        <button type="submit" className="form-button">{selectedEvent ? "Update Event" : "Add Event"}</button>
        {selectedEvent && (
          <button type="button" onClick={handleDelete} className="form-button-delete delete-button">Delete Event</button>
          )}
      </form>
    </div>
    );
};

export default EventForm;


