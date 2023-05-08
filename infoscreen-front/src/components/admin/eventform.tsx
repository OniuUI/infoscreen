// src/components/AdminForm.tsx
import React, { useState } from "react";

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
      await fetch("http://localhost:3001/events", {
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

  return (
    <div>
      <h2>Add Event</h2>
      <div>
        <label>
          Event Name:
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Event Date:
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </label>
      </div>
      <button onClick={addEvent}>Add Event</button>
    </div>
  );
};

export default EventForm;
