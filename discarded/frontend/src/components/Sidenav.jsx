import { FiHome, FiBook, FiUsers, FiLayers, FiCheckSquare, FiLogOut, FiX, FiBell } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

import { useNavigate } from 'react-router-dom';
import ScrollToTopLink from './ScrollToTopLink';
import { useState } from 'react';

export default function SideNav({ isOpen, onClose }) {
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(isOpen);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsMenuOpen(false);
    onClose?.(); // Call prop if provided
  };

  const handleLogout = async () => {
    try {
      const success = await logout();
      if (success) {
        navigate('/login', { replace: true });
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Mobile Overlay - Only shown on mobile when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        bg-gradient-to-b from-[#165C29] to-[#2FC256] text-white 
        flex flex-col justify-between h-screen fixed z-50
        transition-all duration-300
        ${isOpen ? 'left-0' : '-left-full md:left-0'} w-64
      `}>
        {/* Close Button - Only shown on mobile */}
        <button
          onClick={handleClose}
          className="md:hidden absolute top-2 right-2 p-2 text-white hover:bg-white/10 rounded-full"
          aria-label="Close menu"
        >
          <FiX size={24} />
        </button>

        <div className="p-4">
          <div className="flex items-center space-x-2 mb-10">
            <ScrollToTopLink to='/'><img src={logo} alt="Logo" className="w-10 h-10 rounded-full" /></ScrollToTopLink>
            <span className="font-bold text-2xl" style={{ fontFamily: 'Segoe UI' }}><ScrollToTopLink to='/'>FUTO CSC</ScrollToTopLink></span>
            </div>

          <nav className="flex flex-col space-y-2 mt-10">

            <ScrollToTopLink 
              to="/dashboard" 
              className={({ isActive }) => `flex items-center space-x-2 p-3 rounded-lg mx-2 ${isActive ? 'bg-green-400 text-white' : 'hover:bg-white/10'}`}
            >
              <FiHome size={20} />
              <span>Dashboard</span>
            </ScrollToTopLink>

            <ScrollToTopLink 
              to="/" 
              className={({ isActive }) => `flex items-center space-x-2 p-3 rounded-lg mx-2 ${isActive ? 'bg-green-400 text-white' : 'hover:bg-white/10'}`}
            >
              <FiHome size={20} />
              <span>Home</span>
            </ScrollToTopLink>

            <ScrollToTopLink 
              to="/courses" 
              className={({ isActive }) => `flex items-center space-x-2 p-3 rounded-lg mx-2 ${isActive ? 'bg-green-400 text-white' : 'hover:bg-white/10'}`}
            >
              <FiBook size={20} />
              <span>Courses</span>
            </ScrollToTopLink>
            <ScrollToTopLink 
              to="/faculty" 
              className={({ isActive }) => `flex items-center space-x-2 p-3 rounded-lg mx-2 ${isActive ? 'bg-green-400 text-white' : 'hover:bg-white/10'}`}
            >
              <FiUsers size={20} />
              <span>Faculty</span>
            </ScrollToTopLink>
            <ScrollToTopLink 
              to="/resources" 
              className={({ isActive }) => `flex items-center space-x-2 p-3 rounded-lg mx-2 ${isActive ? 'bg-green-400 text-white' : 'hover:bg-white/10'}`}
            >
              <FiLayers size={20} />
              <span>Resources</span>
            </ScrollToTopLink>
            <ScrollToTopLink 
              to="/result" 
              className={({ isActive }) => `flex items-center space-x-2 p-3 rounded-lg mx-2 ${isActive ? 'bg-green-400 text-white' : 'hover:bg-white/10'}`}
            >
              <FiCheckSquare size={20} />
              <span>Result</span>
            </ScrollToTopLink>

            <ScrollToTopLink 
               to="/announcements"
               className={({ isActive }) => `flex items-center space-x-2 p-3 rounded-lg mx-2 ${isActive ? 'bg-green-400 text-white' : 'hover:bg-white/10'}`}
               >
               <FiBell size={20} />
               <span>Announcements</span>
             </ScrollToTopLink>   
             <ScrollToTopLink 
               to="/vote"
               className={({ isActive }) => `flex items-center space-x-2 p-3 rounded-lg mx-2 ${isActive ? 'bg-green-400 text-white' : 'hover:bg-white/10'}`}
                >
               <FiCheckSquare size={20} />
               <span>Vote</span>
              </ScrollToTopLink>            
                       
          </nav>
        </div>

        <div className="p-4 pb-2">
          <button 
            onClick={handleLogout} 
            className="flex items-center space-x-2 text-red-500 hover:bg-white/10 p-3 rounded-lg mx-2 w-full mb-2"
          >
            <FiLogOut size={20} />
            <span>Sign Out</span>
          </button>
          <div className="flex items-center space-x-2 mx-2 p-2">
            <img src={logo} alt="Logo" className="w-8 h-8 rounded-full" />
            <span className="text-white font-bold text-sm">Computer Science</span>
          </div>
        </div>
      </aside>
    </>
  );
}