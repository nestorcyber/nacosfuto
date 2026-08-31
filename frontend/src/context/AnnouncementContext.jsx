import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AnnouncementContext = createContext();

export const AnnouncementProvider = ({ children }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000/api';
      const { data } = await axios.get(`${apiUrl}/announcements`);
      if (data?.announcements) {
        setAnnouncements(data.announcements);
        setUnreadCount(data.announcements.length);
      }
    } catch (error) {
      console.warn('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    setAnnouncements(prev => prev.map(a => 
      a.id === id ? { ...a, read_at: new Date().toISOString() } : a
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
    return true;
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <AnnouncementContext.Provider value={{
      announcements,
      unreadCount,
      loading,
      fetchAnnouncements,
      markAsRead
    }}>
      {children}
    </AnnouncementContext.Provider>
  );
};

export const useAnnouncements = () => useContext(AnnouncementContext);
