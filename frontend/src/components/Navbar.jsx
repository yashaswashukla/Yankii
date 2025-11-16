import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkModeContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-zinc-950 shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 relative">
          <Link
            to="/"
            className="text-2xl font-bold text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
          >
            Yankii
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/add"
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 font-medium transition-colors"
                >
                  Add Word
                </Link>
                <Link
                  to="/review"
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 font-medium transition-colors"
                >
                  Review
                </Link>
                <Link
                  to="/words"
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 font-medium transition-colors"
                >
                  My Words
                </Link>
                <button
                  onClick={toggleDarkMode}
                  className="border-2 border-gray-200 dark:border-zinc-700 rounded-full p-2 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all hover:rotate-180 flex items-center justify-center w-10 h-10 text-xl"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? "☀️" : "🌙"}
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-black font-medium px-5 py-2 rounded-lg transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={toggleDarkMode}
                  className="border-2 border-gray-200 dark:border-zinc-700 rounded-full p-2 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all hover:rotate-180 flex items-center justify-center w-10 h-10 text-xl"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? "☀️" : "🌙"}
                </button>
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-500 hover:bg-indigo-600 text-black font-medium px-5 py-2 rounded-lg transition-all"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden border-2 border-gray-200 dark:border-zinc-700 rounded-md p-2 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all text-2xl text-gray-900 dark:text-gray-100"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 right-0 bg-white dark:bg-zinc-950 border-l border-b border-gray-200 dark:border-zinc-800 shadow-lg min-w-[200px]">
          <div className="flex flex-col p-4 gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className="text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900 py-3 px-4 rounded-lg text-center font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/add"
                  onClick={closeMobileMenu}
                  className="text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900 py-3 px-4 rounded-lg text-center font-medium transition-colors"
                >
                  Add Word
                </Link>
                <Link
                  to="/review"
                  onClick={closeMobileMenu}
                  className="text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900 py-3 px-4 rounded-lg text-center font-medium transition-colors"
                >
                  Review
                </Link>
                <Link
                  to="/words"
                  onClick={closeMobileMenu}
                  className="text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900 py-3 px-4 rounded-lg text-center font-medium transition-colors"
                >
                  My Words
                </Link>
                <button
                  onClick={toggleDarkMode}
                  className="w-full border-2 border-gray-200 dark:border-zinc-700 rounded-lg py-3 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all flex items-center justify-center text-xl h-11"
                >
                  {isDarkMode ? "☀️" : "🌙"}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 hover:bg-red-600 text-black font-medium py-3 rounded-lg transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={toggleDarkMode}
                  className="w-full border-2 border-gray-200 dark:border-zinc-700 rounded-lg py-3 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all flex items-center justify-center text-xl h-11"
                >
                  {isDarkMode ? "☀️" : "🌙"}
                </button>
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900 py-3 px-4 rounded-lg text-center font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-black font-medium py-3 rounded-lg transition-all text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
