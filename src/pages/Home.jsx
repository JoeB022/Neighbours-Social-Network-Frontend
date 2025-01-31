import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Welcome to the Neighborhood Social Network Dashboard</h2>
          <p>Stay connected with your neighbors and local events!</p>
          <Link to="/create-event">
            <button className="cta-button">Create an Event</button>
          </Link>
        </div>
      </section>

      {/* Event Highlights */}
      <section className="event-highlights">
        <h2>Upcoming Events</h2>
        <div className="event-cards">
          <div className="event-card">
            <h4>Community Cleanup</h4>
            <p>Join us for a neighborhood cleanup event to make our streets shine!</p>
            <Link to="/events">
              <button className="cta-button">See More</button>
            </Link>
          </div>
          <div className="event-card">
            <h4>Local Potluck Dinner</h4>
            <p>Come together for a fun and delicious potluck dinner with your neighbors.</p>
            <Link to="/events">
              <button className="cta-button">See More</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="home-footer">
        <p>&copy; 2025 Neighborhood Social Network. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
