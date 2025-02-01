import { useContext, useEffect, useState } from "react";
import { EventContext } from "../context/EventContext";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Events = () => {
  const { events, setEvents, rsvpToEvent, deleteEvent } = useContext(EventContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Hook to navigate to the update page
   // State to handle loading and error
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   // Fetch events from the backend when component mounts
   useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/events/view");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data); // Assuming setEvents updates the context state
        setLoading(false); // Stop loading once data is fetched
      } catch (err) {
        setError(err.message); // Set error if the request fails
        setLoading(false); // Stop loading on error
      }
    };

    fetchEvents();
  }, [setEvents]);


  const handleRSVP = (eventId, status) => {
    if (!user) {
      alert("You must be logged in to RSVP.");
      return;
    }
    rsvpToEvent(eventId, user.user_id, status);
  };

  const handleDelete = (eventId) => {
    deleteEvent(eventId); // Call the delete event function from context
  };

  const handleUpdate = (eventId) => {
    // Navigate to the update event page, passing the event ID
    navigate(`/update-event/${eventId}`);
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
        <br></br>
      <h2>Upcoming Events</h2>
      <br></br>
      {events.length === 0 ? (
        <p>No events yet.</p>
      ) : (
        events.map((event) => (
          <div key={event.id} className="event-card">
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Organizer:</strong> {event.organizer_id}</p>
            
            {/* RSVP Buttons */}
            <div>
              {event.rsvps?.some((rsvp) => rsvp.userId === user?.user_id) ? (
                <span>You are attending this event</span>
              ) : (
                <>
                  <button onClick={() => handleRSVP(event.id, "attending")}>RSVP Yes</button>
                  <button onClick={() => handleRSVP(event.id, "not attending")}>RSVP No</button>
                </>
              )}
            </div>

            {/* Update and Delete buttons (only for the event organizer) */}
            {user?.user_id === event.organizerId && (
              <div className="event-actions">
                <button onClick={() => handleUpdate(event.id)} className="cta-button update">
                  Update
                </button>
                <button onClick={() => handleDelete(event.id)} className="cta-button delete">
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Events;
