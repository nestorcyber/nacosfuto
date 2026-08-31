import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StaffSideNav from '../components/StaffSidenav'
import SideNav from '../components/Sidenav';
import TopNav from '../components/TopNav';
import { useAnnouncements } from '../context/AnnouncementContext';

export default function CreateAnnouncement() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { fetchAnnouncements } = useAnnouncements();

   useEffect(() => {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'auto'; // force-enable scroll
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/announcements`, 
        { title, content }
      );
      
      if (response.data.success) {
        toast.success('Announcement created successfully!');
        // Refresh announcements before navigating
        await fetchAnnouncements();
        navigate('/announcements', { replace: true });
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error(error.response?.data?.error || 'Failed to create announcement');
    }
  };


  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
     {user?.isStaff && (
             <StaffSideNav
             isOpen={isSidebarOpen} 
             onClose={() => setIsSidebarOpen(false)} 
           />
           )}
     
           {user?.isStudent && (
             <SideNav 
             isOpen={isSidebarOpen} 
             onClose={() => setIsSidebarOpen(false)} 
           />
           )}
      
      <TopNav
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className={`pt-16 transition-all duration-300 ${isSidebarOpen ? 'ml-0 md:ml-64' : 'ml-0 md:ml-64'}`}>
      <ToastContainer position="top-right" autoClose={2000} />
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Create Announcement</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content
              </label>
              <textarea
                id="content"
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Publish Announcement
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}