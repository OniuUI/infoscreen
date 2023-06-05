import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import {apiService} from "../api/apiservice";

interface Event {
  _id: string;
  eventName: string;
  eventDate: string;
}

const EventForm: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('success');

  useEffect(() => {
    fetchEvents();
    }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setStatus('loading');
    try {
      const data = await apiService.get(`/events`);
      if (data) {
        setEvents(data);
        setStatus('success');
      } else {
        setError('No events found');
        setStatus('error');
      }
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
      setStatus('error');
      console.error("Error fetching events data:", error);
    }
  };

  const handleEventChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const eventId = event.target.value;
    const foundEvent = events.find((event) => event._id === eventId);
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
      _id: selectedEvent ? selectedEvent._id : uuidv4(),
      eventName,
      eventDate,
    };

    try {
      if (selectedEvent) {
        await apiService.put(`/events/${selectedEvent._id}`, eventObj);
      } else {
        await apiService.post(`/events`, eventObj);
      }

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
        await apiService.delete(`/events/${selectedEvent._id}`);
        alert("Event deleted successfully!");
        setEvents(events.filter(event => event._id !== selectedEvent._id));
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
      {status === 'loading' && <p>Loading...</p>}
      {status === 'error' && <p>Error: {error}</p>}
      <form onSubmit={handleSubmit} className="event-form">
        <label>
          Select Event:
          <select onChange={handleEventChange} value={selectedEvent?._id || ""}>
            <option value="">New Event</option>
            {status === 'success' && events.map((event) => (
              <option key={event._id} value={event._id}>
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
