import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("id");
    localStorage.removeItem("name");
    window.location.href = "/"; // This forces a full page reload
  };

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="font-bold text-2xl hover:text-blue-400 transition-colors duration-300"
            >
              Freelancer HUB
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {token ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/jobs" 
                  className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                >
                  Jobs
                </Link>
                {(user?.role === 'employer' || user?.role === 'admin') && (
                  <Link 
                    to="/add-job" 
                    className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                  >
                    Add Job
                  </Link>
                )}
                {(user?.role === 'employer' || user?.role === 'admin') && (
                  <Link 
                    to="/applications" 
                    className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                  >
                    Applications
                  </Link>
                )}
                {(user?.role === 'employer' || user?.role === 'freelancer') && (
                  <Link 
                    to="/chat" 
                    className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                  >
                    Chat
                  </Link>
                )}
                <button 
                  onClick={handleLogout} 
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;