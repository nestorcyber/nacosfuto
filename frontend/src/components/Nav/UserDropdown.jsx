import React, { useState } from 'react';
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import ScrollToTopLink from '../ScrollToTopLink';

const UserDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
 

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
       
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-50">
          <ScrollToTopLink
            to="/profile"
            className="flex items-center px-4 py-2 text-white hover:bg-gray-600"
            onClick={() => setIsOpen(false)}
          >
            <FiUser className="mr-2" /> Profile
          </ScrollToTopLink>
          
          <ScrollToTopLink
            to="/settings"
            className="flex items-center px-4 py-2 text-white hover:bg-gray-600"
            onClick={() => setIsOpen(false)}
          >
            <FiSettings className="mr-2" /> Settings
          </ScrollToTopLink>
          
          <ScrollToTopLink
            to="/logout"
            className="flex items-center px-4 py-2 text-red-400 hover:bg-gray-600 hover:text-red-300"
            onClick={() => setIsOpen(false)}
          >
            <FiLogOut className="mr-2" /> Logout
          </ScrollToTopLink>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;