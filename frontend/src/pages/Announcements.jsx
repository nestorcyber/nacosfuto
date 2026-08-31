import React, { useEffect } from 'react';
import { useAnnouncements } from '../context/AnnouncementContext';
import { FiBell } from 'react-icons/fi';
import Navbar from '../components/Nav/Navbar';
import Footer from '../components/Footer';

export default function Announcements() {
  const { announcements, loading } = useAnnouncements();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'auto';
  }, []);

  const sampleAnnouncements = [
    {
      id: 1,
      title: 'Departmental Orientation for Freshmen',
      content: 'All newly admitted students of Computer Science are invited to the departmental orientation taking place at the SEET Complex Hall.',
      created_at: new Date().toISOString(),
      author: 'Department Secretary'
    },
    {
      id: 2,
      title: 'NACOS Week 2026 Registration & Schedule',
      content: 'Get ready for an exciting lineup of hackathons, workshops, games, and career talks. Check the events page for the full schedule.',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      author: 'NACOS Executives'
    },
    {
      id: 3,
      title: 'Academic Calendar Update: Harmattan Semester Exams',
      content: 'The revised academic timetable and exam guidelines for the semester have been updated on the official notice board.',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      author: 'Academic Planning Committee'
    }
  ];

  const displayAnnouncements = announcements && announcements.length > 0 ? announcements : sampleAnnouncements;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto p-6 w-full py-12">
        <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
            <FiBell size={24} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Announcements & Notices</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Official bulletins and department updates
            </p>
          </div>
        </div>

        {loading ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">Loading announcements...</p>
          </div>
        ) : displayAnnouncements.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-12 text-center">
            <p className="text-gray-600 dark:text-gray-300">No announcements available at this time.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {displayAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-800"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{announcement.title}</h3>
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full whitespace-nowrap">
                    {new Date(announcement.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                  {announcement.content}
                </p>
                <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Posted by: {announcement.author || (announcement.first_name ? `${announcement.first_name} ${announcement.last_name}` : 'Admin')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
