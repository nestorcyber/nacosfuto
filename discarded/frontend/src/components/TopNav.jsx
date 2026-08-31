import { useAuth } from '../context/AuthContext';
import { FiSearch, FiBell, FiMenu, FiSun, FiMoon, FiMonitor } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import ScrollToTopLink from './ScrollToTopLink';
import { useAnnouncements } from '../context/AnnouncementContext';
import SearchBar from './SearchBar';


export default function TopNav({ onToggleSidebar, isSidebarOpen }) {
  const { user } = useAuth();
  const initials = user ? `${user.first_name?.[0]}${user.last_name?.[0]}`.toUpperCase() : '??';
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { unreadCount } = useAnnouncements();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      const query = search.trim().toLowerCase();
      const knownRoutes = ['dashboard', 'courses', 'faculty', 'resources', 'results'];
      
      if (knownRoutes.includes(query)) {
        navigate(`/${query}`);
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
  
      setSearch('');
    }
  };
  
    
  const getThemeIcon = () => {
    switch(theme) {
      case 'dark': return <FiSun size={20} />;
      case 'light': return <FiMoon size={20} />;
      default: return <FiMonitor size={20} />;
    }
  };

  return (
    <div className={`flex justify-between items-center bg-[#FAF2F2] dark:bg-gray-800 p-4 shadow-md fixed top-0 right-0 left-0 md:left-64 z-30 transition-colors duration-300 ${isSidebarOpen ? 'md:left-64' : ''}`}>
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-gray-700 dark:text-gray-300 mr-2"
        onClick={onToggleSidebar}
        aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
      >
        <FiMenu size={24} />
      </button>

      <div className="flex-1 flex justify-end items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full focus:outline-none text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label={`Toggle theme (current: ${theme})`}
        >
          {getThemeIcon()}
        </button>

        {/* Search Bar */}
        <SearchBar />
        
        {/* Notification and Profile */}
        <div className="flex">
        <ScrollToTopLink to="/profile">
          <div className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-full w-10 h-10 flex items-center justify-center border border-black dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <span className="font-bold">{initials}</span>
          </div>
          </ScrollToTopLink>  

      <ScrollToTopLink to="/announcements">
  <div className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-full w-10 h-10 flex items-center justify-center border border-black dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
    <FiBell size={18} />
    {unreadCount > 0 && (
      <span className="absolute top-[13px] right-[8px] bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {unreadCount}
      </span>
    )}
  </div>
  </ScrollToTopLink>

        </div>
      </div>
    </div>
  );
}