import React, { useEffect, useState } from 'react';
import { useAnnouncements } from '../context/AnnouncementContext';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiX } from 'react-icons/fi';

export default function UnreadAnnouncementBanner() {
  const { unreadCount, announcements, markAsRead, fetchAnnouncements } = useAnnouncements();
  const [showBanner, setShowBanner] = useState(false);
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (unreadCount > 0) {
      const latest = announcements.find(a => 
        !a.read_at || new Date(a.read_at) < new Date(a.created_at)
      );
      setLatestAnnouncement(latest);
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, [unreadCount, announcements]);

  const handleClick = async () => {
    if (latestAnnouncement) {
      // Immediately hide the banner
      setShowBanner(false);
      
      // Mark as read on server
      await markAsRead(latestAnnouncement.id);
      
      // Navigate and force refresh by using window.location
      window.location.href = '/announcements';
    }
  };

  const handleDismiss = async () => {
    if (latestAnnouncement) {
      // Immediately hide the banner
      setShowBanner(false);
      
      // Mark as read on server
      await markAsRead(latestAnnouncement.id);
      
      // Refresh announcements list
      await fetchAnnouncements();
    }
  };

  if (!showBanner || !latestAnnouncement) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-green-600 text-white p-4 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleClick}>
          <FiBell className="text-xl" />
          <div>
            <h3 className="font-bold">{latestAnnouncement.title}</h3>
            <p className="text-sm line-clamp-1">{latestAnnouncement.content}</p>
          </div>
        </div>
        <button 
          onClick={handleDismiss}
          className="p-1 hover:bg-green-700 rounded-full transition-colors"
          aria-label="Dismiss"
        >
          <FiX className="text-lg" />
        </button>
      </div>
    </div>
  );
}