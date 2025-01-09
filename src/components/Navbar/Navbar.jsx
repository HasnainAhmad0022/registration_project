import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userData = JSON.parse(sessionStorage.getItem("userData"));
//   console.log(userData);

  const navItems = [
    {
      id: 1,
      title: 'Member',
      path: '/register/member'
    },
    {
      id: 2,
      title: 'Student',
      path: '/register-student'
    },
    {
      id: 3,
      title: 'Disabled Person',
      path: '/register-disabled'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Left side - Logo & Navigation */}
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/home-page')}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">D</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4 items-center">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className="px-4 py-2 rounded-full text-gray-700 hover:text-blue-600 font-medium 
                           hover:bg-blue-50 transition-all duration-300 ease-in-out
                           relative group"
                >
                  {item.title}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 
                                 group-hover:scale-x-100 transition-transform duration-300 ease-in-out">
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right side - User Profile & Logout */}
          <div className="flex items-center space-x-4">
            {/* User Profile */}
            <div className="hidden sm:flex items-center space-x-3 pr-4 border-r border-gray-200">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 
                            flex items-center justify-center text-white font-bold text-lg">
                A
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-700">Admin User</p>
                <p className="text-gray-500">admin@example.com</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-full text-white
                       bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600
                       transform hover:scale-105 transition-all duration-300 ease-in-out
                       shadow-md hover:shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10 3a1 1 0 00-1.707-.707L8 8.586V5a1 1 0 00-2 0v10a1 1 0 002 0v-3.586l3.293 3.293a1 1 0 001.414-1.414L9.414 10l3.293-3.293A1 1 0 0013 6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Logout</span>
            </button>

            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 
                         hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 
                         focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 py-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 
                       hover:text-blue-600 transition-colors duration-200"
            >
              {item.title}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;