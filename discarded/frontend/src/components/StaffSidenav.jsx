import { FiHome, FiBook, FiUsers, FiLayers, FiCheckSquare, FiLogOut, FiX, FiPlus, FiBell, FiBarChart2, FiClock, FiAward } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import ScrollToTopLink from './ScrollToTopLink';
import { useState } from 'react';

export default function StaffSideNav({ isOpen, onClose }) {
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(isOpen);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsMenuOpen(false);
    onClose?.();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        bg-gradient-to-b from-[#165C29] to-[#2FC256] text-white
        flex flex-col fixed z-50
        transition-all duration-300
        ${isOpen ? 'left-0' : '-left-full md:left-0'} w-64
        h-screen
      `}>
        <button
          onClick={handleClose}
          className="md:hidden absolute top-2 right-2 p-2 text-white hover:bg-white/10 rounded-full"
          aria-label="Close menu"
        >
          <FiX size={24} />
        </button>

        <div className="p-4 flex-shrink-0">
          <div className="flex items-center space-x-2 mb-6">
          <ScrollToTopLink to='/'><img src={logo} alt="Logo" className="w-10 h-10 rounded-full" /></ScrollToTopLink>
            <span className="font-bold text-2xl" style={{ fontFamily: 'Segoe UI' }}><ScrollToTopLink to='/'>FUTO CSC</ScrollToTopLink></span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col space-y-1 px-2 pb-4">
            <ScrollToTopLink 
              to="/staff-dashboard" 
              className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg ${isActive ? 'bg-green-400 text-white' : 'hover:bg-white/10'}`}
            >
              <FiHome size={20} />
              <span>Dashboard</span>
            </ScrollToTopLink>

            <ScrollToTopLink 
              to="/" 
              className={({ isActive }) => `flex items-center space-x-2 p-3 pl-1 rounded-lg mx-2 ${isActive ? 'bg-green-400 text-white' : 'hover:bg-white/10'}`}
            >
              <FiHome size={20} />
              <span>Home</span>
            </ScrollToTopLink>
            
            <ScrollToTopLink 
              to="/courses" 
              className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg ${isActive ? 'bg-green-400 text-white' : 'hover:bg-white/10'}`}
            >
              <FiBook size={20} />
              <span>Courses</span>
            </ScrollToTopLink>
            
            <ScrollToTopLink 
              to="/faculty" 
              className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg ${isActive ? 'bg-green-400 text-white' : 'hover:bg-white/10'}`}
            >
              <FiUsers size={20} />
              <span>Faculty</span>
            </ScrollToTopLink>
            
            <ScrollToTopLink 
              to="/resources" 
              className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg ${isActive ? 'bg-green-400 text-white' : 'hover:bg-white/10'}`}
            >
              <FiLayers size={20} />
              <span>Resources</span>
            </ScrollToTopLink>

            <ScrollToTopLink 
              to="/result" 
              className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg ${isActive ? 'bg-green-400 text-white' : 'hover:bg-white/10'}`}
            >
              <FiCheckSquare size={20} />
              <span>Result</span>
            </ScrollToTopLink>

            <ScrollToTopLink 
              to="/create-announcement"
              className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg ${isActive ? 'bg-green-400 text-white' : 'hover:bg-white/10'}`}
            >
              <FiPlus size={20} />
              <span>Create Announcement</span>
            </ScrollToTopLink>

            <ScrollToTopLink 
              to="/announcements"
              className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg ${isActive ? 'bg-green-400 text-white' : 'hover:bg-white/10'}`}
            >
              <FiBell size={20} />
              <span>Announcements</span>
            </ScrollToTopLink>       

            <ScrollToTopLink 
              to="/election-management"
              className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg ${isActive ? 'bg-green-400 text-white' : 'hover:bg-white/10'}`}
            >
              <FiClock size={20} />
              <span>Manage Elections</span>
            </ScrollToTopLink>

            <ScrollToTopLink 
              to="/election-results"
              className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg ${isActive ? 'bg-green-400 text-white' : 'hover:bg-white/10'}`}
            >
              <FiBarChart2 size={20} />
              <span>Election Results</span>
            </ScrollToTopLink>
          </nav>
        </div>

        <div className="p-4 pb-2 flex-shrink-0">
          <button 
            onClick={handleLogout} 
            className="flex items-center space-x-3 text-red-400 hover:bg-white/10 p-3 rounded-lg w-full mb-2"
          >
            <FiLogOut size={20} />
            <span>Sign Out</span>
          </button>
          <div className="flex items-center space-x-2 p-2">
            <img src={logo} alt="Logo" className="w-8 h-8 rounded-full" />
            <span className="text-white font-bold text-sm">Computer Science</span>
          </div>
        </div>
      </aside>
    </>
  );
}