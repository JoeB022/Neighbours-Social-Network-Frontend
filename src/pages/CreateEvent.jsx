import { useState, useContext } from "react";
import { EventContext } from "../context/EventContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const { user } = useContext(AuthContext); // Accessing the user from context
  const { addEvent } = useContext(EventContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(""); // Stores the date in YYYY-MM-DD format
  const [location, setLocation] = useState("");

  // Function to handle date change and format it to YYYY-MM-DD
  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const formattedDate = selectedDate.toISOString().split("T")[0]; // Converts to YYYY-MM-DD
    setDate(formattedDate);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    
    console.log("User Data:", user); // Debugging
    console.log("Access Token:", user?.access_token); // Debugging

    if (!user || !user.access_token) {
      alert("You must be logged in to create an event!");
      return;
    }

    const eventData = {
      title,
      description,
      date,
      location,
      organizer_id: user.id, // Using user.id from context
    };

    try {
      const response = await fetch("http://localhost:5000/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const data = await response.json();
        addEvent(data);
        alert("Event created successfully!");
        navigate("/events");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("An error occurred while creating the event.");
    }
  };

  return (
    <div>
      <h2>Create Event</h2>
      <form onSubmit={handleCreateEvent}>
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={handleDateChange} // Ensure proper formatting
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
