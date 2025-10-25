import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import { Instagram, Linkedin, Github } from "lucide-react";

const Footer = () => {
  const { user } = useAuth(); 
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 py-10 px-4 text-sm">
      {" "}
      <div className="max-w-6xl mx-auto flex flex-row justify-around  md:items-start text-center md:text-left gap-8">
        {" "}
        <div className="hidden md:block md:w-1/4">
          <h3 className="font-semibold text-white mb-2">About the Creator</h3>{" "}
          <p className="text-gray-400 text-sm leading-relaxed">
            {" "}
            A passionate developer focused on
            creating innovative solutions and meaningful user experiences.{" "}
            
          </p>
        </div>
        <div className="flex flex-col items-center md:items-start">
          {" "}
          <h3 className="font-semibold text-white mb-2">Quick Links</h3>
          <ul className="list-none space-y-1 text-gray-400">
            {" "}
            <li>
              <Link to="/" className="hover:text-white hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/recipes" className="hover:text-white hover:underline">
                Recipes
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white hover:underline">
                About
              </Link>
            </li>
            {user ? (
              <li>
                <Link
                  to="/profile"
                  className="hover:text-white hover:underline"
                >
                  Profile
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/auth" className="hover:text-white hover:underline">
                  Login/Sign Up
                </Link>
              </li>
            )}
          </ul>
        </div>
        
        <div className="flex flex-col items-center md:items-start">
          {" "}
          
          <h3 className="font-semibold text-white mb-2">Connect</h3>
          <ul className="list-none flex space-x-5 text-gray-400">
            {" "}
           
            <li>
              <a
                href="https://www.instagram.com/rohan_gupta_c53/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Instagram Profile" // Added accessibility label
              >
                <Instagram size={20} /> 
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/rohan-kumar-2b2ab9326/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={20} />
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Necro-Rohan"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="GitHub Profile"
              >
                <Github size={20} />
              </a>
            </li>
          </ul>
        </div>
      </div>
 
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-700 text-center">

        <p className="text-gray-500">
          &copy; {currentYear} Rohan Kumar | Taste Maker Project. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
