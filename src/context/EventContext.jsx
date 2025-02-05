import { createContext, useState, useEffect } from "react";

const EventContext = createContext();

const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  // Fetch events from backend on app start
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/events/view");
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  // Create an event
  const createEvent = async (title, description, date, location, organizer) => {
    const newEvent = { id: Date.now(), title, description, date, location, organizer, rsvps: [] };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    localStorage.setItem("events", JSON.stringify([...events, newEvent]));
  };

  // RSVP to an event
  const rsvpToEvent = (eventId, userId, status) => {
    const updatedEvents = events.map((event) =>
      event.id === eventId ? { ...event, rsvps: [...event.rsvps, { userId, status }] } : event
    );
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  // Delete an event
  const deleteEvent = async (eventId) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`http://localhost:5000/events/delete/${eventId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to delete event");
      setEvents(events.filter((event) => event.id !== eventId));
      localStorage.setItem("events", JSON.stringify(events.filter((event) => event.id !== eventId)));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
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
    <EventContext.Provider value={{ events, createEvent, rsvpToEvent, deleteEvent, updateEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export { EventContext, EventProvider };
