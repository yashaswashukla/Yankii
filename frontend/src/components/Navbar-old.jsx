import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkModeContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="nav-brand">
          📚 VocabSRS
        </Link>
        <div className="nav-links">
          {isAuthenticated && (
            <>
              <Link
                to="/"
                className={`nav-link ${isActive("/") ? "active" : ""}`}
              >
                Dashboard
              </Link>
              <Link
                to="/add"
                className={`nav-link ${isActive("/add") ? "active" : ""}`}
              >
                Add Word
              </Link>
              <Link
                to="/review"
                className={`nav-link ${isActive("/review") ? "active" : ""}`}
              >
                Review
              </Link>
              <Link
                to="/words"
                className={`nav-link ${isActive("/words") ? "active" : ""}`}
              >
                Word List
              </Link>
            </>
          )}

          <button
            onClick={toggleDarkMode}
            className="dark-mode-toggle"
            aria-label="Toggle dark mode"
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>

          {isAuthenticated && (
            <button onClick={logout} className="btn btn-secondary btn-sm">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
