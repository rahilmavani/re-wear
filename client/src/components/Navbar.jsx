import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, Package, Plus, Home, ShoppingBag, Settings } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  
  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-[#8f00ff]">ReWear</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-[#8f00ff] px-3 py-2 rounded-md">
              Home
            </Link>
            <Link to="/items" className="text-gray-700 hover:text-[#8f00ff] px-3 py-2 rounded-md">
              Browse Items
            </Link>
            {user && (
              <>
                <Link to="/add-item" className="text-gray-700 hover:text-[#8f00ff] px-3 py-2 rounded-md">
                  Add Item
                </Link>
                <Link to="/dashboard" className="text-gray-700 hover:text-[#8f00ff] px-3 py-2 rounded-md">
                  Dashboard
                </Link>
                {isAdmin() && (
                  <Link to="/admin" className="text-gray-700 hover:text-[#8f00ff] px-3 py-2 rounded-md">
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  className="flex items-center space-x-2 text-gray-700 hover:text-[#8f00ff] px-3 py-2 rounded-md"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <User size={20} />
                  <span>{user.name}</span>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl z-20">
                    <div className="px-4 py-2 text-sm text-gray-500 border-b">
                      <div>{user.name}</div>
                      <div className="text-xs">{user.email}</div>
                      <div className="text-xs font-semibold mt-1">Points: {user.points}</div>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package size={16} className="mr-2" /> My Items
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="bg-white text-[#8f00ff] border border-[#8f00ff] px-4 py-2 rounded hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#8f00ff] text-white px-4 py-2 rounded hover:bg-[#6f00c4]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-[#8f00ff] focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t py-2">
          <div className="container mx-auto px-4 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={20} className="mr-2" /> Home
            </Link>
            <Link
              to="/items"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingBag size={20} className="mr-2" /> Browse Items
            </Link>

            {user ? (
              <>
                <Link
                  to="/add-item"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Plus size={20} className="mr-2" /> Add Item
                </Link>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={20} className="mr-2" /> Dashboard
                </Link>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings size={20} className="mr-2" /> Admin
                  </Link>
                )}
                <div className="border-t border-gray-200 my-2"></div>
                <div className="px-3 py-2 text-sm text-gray-500">
                  <div>Logged in as {user.name}</div>
                  <div className="text-xs">Points: {user.points}</div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <LogOut size={20} className="mr-2" /> Logout
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-[#8f00ff] hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
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