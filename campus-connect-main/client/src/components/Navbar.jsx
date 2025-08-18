import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = sessionStorage.getItem('userId') !== null; // Check if user is logged in
  const [isProfileComplete, setIsProfileComplete] = useState(sessionStorage.getItem('isComplete') === 'true'); // Check if profile is complete

  const handleLogout = () => {
    // Add your logout logic here
    // For example: clear local storage, cookies, etc.
    // localStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    // Navigate to login page after logout
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-campus-purple font-bold text-xl">Campus<span className="text-campus-blue">Connect</span></span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {isProfileComplete && (
                  <Link to="/dashboard" className="text-gray-700 hover:text-campus-purple px-3 py-2 rounded-md font-medium">
                    Dashboard
                  </Link>)}
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-campus-purple px-3 py-2 rounded-md font-medium"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
                {isProfileComplete && (
                  <Link to="/profile" className="flex items-center justify-center w-10 h-10 rounded-full bg-campus-purple text-white">
                    {/* Replace with user's initials or avatar */}
                    <span>U</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-campus-purple hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="block text-center py-2 px-4 my-2 rounded-md btn-secondary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block text-center py-2 px-4 my-2 rounded-md btn-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="block text-gray-700 hover:text-campus-purple hover:bg-gray-100 px-3 py-2 rounded-md font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block text-gray-700 hover:text-campus-purple hover:bg-gray-100 px-3 py-2 rounded-md font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center text-gray-700 hover:text-campus-purple hover:bg-gray-100 px-3 py-2 rounded-md font-medium"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;