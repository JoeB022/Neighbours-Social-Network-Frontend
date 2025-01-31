import { createContext, useState, useEffect } from "react";

const EventContext = createContext();

const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  // Load events from localStorage or fetch from backend on app start
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/events/view");
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        setEvents(data); // Set fetched events in context state
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  const addEvent = (newEvent) => {
    createEvent(
      newEvent.title,
      newEvent.description,
      newEvent.date,
      newEvent.location,
      newEvent.organizer_id
    );
  };

  // Create an event
  const createEvent = (title, description, date, location, organizer) => {
    const newEvent = { id: Date.now(), title, description, date, location, organizer, rsvps: [] };
    const updatedEvents = [...events, newEvent];

    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  // RSVP to an event
  const rsvpToEvent = (eventId, userId, status) => {
    const updatedEvents = events.map((event) =>
      event.id === eventId
        ? { ...event, rsvps: [...event.rsvps, { userId, status }] }
        : event
    );

    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  // Delete an event
  const deleteEvent = (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);

    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  // Update an event
  const updateEvent = (updatedEvent) => {
    const updatedEvents = events.map((event) =>
      event.id === updatedEvent.id ? updatedEvent : event
    );

    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  return (
    <EventContext.Provider value={{ events, setEvents, addEvent,createEvent, rsvpToEvent, deleteEvent, updateEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export { EventContext, EventProvider };
