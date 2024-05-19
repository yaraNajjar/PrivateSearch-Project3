// Navbar.js
import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ isLoggedIn, logout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Then navigate to the login page
    logout();
  };
  return (
    isLoggedIn && (
      <div>
        {" "}
        <nav className="navbar">
          <div className="logout-container">
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </nav>
      </div>
    )
  );
}

export default Navbar;
