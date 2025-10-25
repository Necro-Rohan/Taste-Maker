import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUtensils, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext"; 

const DEFAULT_AVATAR =
  "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth(); 

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="md:hidden items-center ">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <FaTimes className="block h-6 w-6" />
              ) : (
                <FaBars className="block h-6 w-6" />
              )}
            </button>
          </div>
          <div className="shrink-0 flex items-center">
            <Link to="/" className="flex items-center text-gray-800">
              <FaUtensils className="h-6 w-6 text-indigo-600 mr-2" />
              <span className="font-bold text-xl tracking-tight">
                TASTE MAKER
              </span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/recipes"
              className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Get Recipes
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              About
            </Link>
          </div>

          <div className="hidden md:block">
            {user ? (
              <div className="ml-4 flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center text-gray-600 hover:text-indigo-600 rounded-md text-sm font-medium"
                >
                  <span className="mr-2">
                    Hi, {user.username.toUpperCase()}
                  </span>
                  <img
                    src={user.profilePicture || DEFAULT_AVATAR}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </Link>
              </div>
            ) : (
              <Link
                to="/auth"
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Login
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            {/* <button
              onClick={toggleMobileMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <FaTimes className="block h-6 w-6" />
              ) : (
                <FaBars className="block h-6 w-6" />
              )}
            </button> */}
            {!isMobileMenuOpen && !user && (
              <Link
                to="/auth"
                className="ml-4 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Login
              </Link>
            )}
            {user && (
              <Link
                to="/profile"
                className="ml-4 flex items-center text-gray-600 hover:text-indigo-600 rounded-md text-sm font-medium"
              >
                <img
                  src={user.profilePicture || DEFAULT_AVATAR}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
              </Link>
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="text-gray-700 hover:bg-gray-50 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/recipes"
              className="text-gray-700 hover:bg-gray-50 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMobileMenu}
            >
              Get Recipes
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:bg-gray-50 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMobileMenu}
            >
              About
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-5">
              {!user && (
                <Link
                  to="/auth"
                  className="block w-full text-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  onClick={toggleMobileMenu}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;