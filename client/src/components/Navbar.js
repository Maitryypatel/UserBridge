import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const [profilePic, setProfilePic] = useState(user?.profilePicture || "");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setProfilePic(user?.profilePicture || "");
  }, [user]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
  };

  return (
    <nav className="bg-black text-white shadow-md p-4 sticky top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-3xl font-medium">
          UserBridge
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:text-gray-300 text-xl">
            Home
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/users" className="hover:text-gray-300 text-xl">
                Users
              </Link>

              <Link to="/add-faq" className="hover:text-gray-300 text-xl">
                Add FAQ
              </Link>
              <Link to="/faq-list" className="hover:text-gray-300 text-xl">
                FAQ List
              </Link>
            </>
          )}
        </div>

        {/* Profile & Mobile Menu */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="relative focus:outline-none flex items-center space-x-2"
              >
                {profilePic ? (
                  <img
                    src={
                      profilePic.startsWith("http")
                        ? profilePic
                        : `https://userbridge-2.onrender.com/uploads/${profilePic}`
                    }
                    alt="Profile"
                    className="w-11 h-11 rounded-full border border-gray-300"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gray-700 text-white flex items-center justify-center font-bold text-lg">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </button>

              {/* Profile Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg overflow-hidden">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden focus:outline-none"
          >
            {isOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 text-white w-full flex flex-col items-center py-4 space-y-4">
          <Link
            to="/"
            className="hover:text-gray-300"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/users"
                className="hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Users
              </Link>
              
              <Link
                to="/add-faq"
                className="hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Add FAQ
              </Link>
              <Link
                to="/faq-list"
                className="hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                FAQ List
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
