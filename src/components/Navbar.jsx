import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* App Name */}
        <h1 className="navbar-title">Neighborhood Network</h1>

        {/* Navigation Links */}
        <ul className="navbar-links">
          <li><Link to="/" className="navbar-link">Home</Link></li>
          <li><Link to="/events" className="navbar-link">Events</Link></li>
          <li><a href="http://127.0.0.1:5000/" target="_blank" className="navbar-link">API Documentation</a></li>
        </ul>

        {/* Right-Side: Show Logout if logged in, otherwise show Login/Register */}
        <div className="navbar-user">
          {user ? (
            <>
              <span className="navbar-username">Welcome, {user.name}!</span>
              <button onClick={logout} className="navbar-btn">Logout</button>
            </>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-link">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
