// src/components/AdminForm.tsx
import React, { useState } from "react";
import { API_BASE_URL } from "../../apiConfig"; // Import the API_BASE_URL

const EventForm: React.FC = () => {
  // Event form state
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");

  const addEvent = async () => {
    // Validate inputs
    if (!eventName || !eventDate) {
      alert("Please fill in all fields for the event.");
      return;
    }

    const newEvent = {
      eventName,
      eventDate,
    };

    try {
      await fetch(`${API_BASE_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });
      alert("Event added successfully");
      setEventName("");
      setEventDate("");
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault(); // This prevents the default form submission behavior
  addEvent();
};

return (
  <div className="form-container">
    <h2>Add Event</h2>
    <form className="event-form" onSubmit={handleSubmit}>
      <label>
        Event Name:
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="form-input"
          required
        />
      </label>
      <label>
        Event Date:
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="form-input"
          required
        />
      </label>
      <button type="submit" className="form-button">Add Event</button>
    </form>
  </div>
  );
};

export default EventForm;
