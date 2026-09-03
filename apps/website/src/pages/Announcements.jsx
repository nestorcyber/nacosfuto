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
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#041801] text-[#083002] dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto p-6 w-full py-12">
        <div className="flex items-center gap-4 mb-8 pb-4 border-b border-[#138601]/20 dark:border-[#138601]/30">
          <div className="w-12 h-12 bg-[#138601]/10 dark:bg-[#138601]/25 rounded-2xl flex items-center justify-center border border-[#138601]/20">
            <FiBell size={24} className="text-[#138601] dark:text-[#4bd043]" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#083002] dark:text-white">Announcements & Notices</h1>
            <p className="text-[#083002]/70 dark:text-green-100/70 text-sm mt-1">
              Official bulletins and department updates
            </p>
          </div>
        </div>

        {loading ? (
          <div className="bg-[#f8fdf7] dark:bg-[#083002] rounded-3xl p-12 text-center border border-[#138601]/20 dark:border-[#138601]/30">
            <p className="text-[#083002]/70 dark:text-green-100/70 font-semibold">Loading announcements...</p>
          </div>
        ) : displayAnnouncements.length === 0 ? (
          <div className="bg-[#f8fdf7] dark:bg-[#083002] rounded-3xl p-12 text-center border border-[#138601]/20 dark:border-[#138601]/30">
            <p className="text-[#083002]/70 dark:text-green-100/70 font-semibold">No announcements available at this time.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {displayAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="border border-[#138601]/20 dark:border-[#138601]/30 p-7 rounded-3xl shadow-md hover:shadow-2xl transition-all bg-[#f8fdf7] dark:bg-[#083002] hover:border-[#138601] dark:hover:border-[#4bd043]"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <h3 className="text-xl font-bold text-[#083002] dark:text-white">{announcement.title}</h3>
                  <span className="text-xs font-extrabold text-[#138601] dark:text-[#4bd043] bg-white dark:bg-[#041801] px-3 py-1 rounded-full border border-[#138601]/20 whitespace-nowrap shadow-sm">
                    {new Date(announcement.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <p className="mt-3 text-[#083002]/75 dark:text-green-100/75 leading-relaxed text-base">
                  {announcement.content}
                </p>
                <div className="mt-5 pt-4 border-t border-[#138601]/15 dark:border-white/10 flex items-center justify-between text-xs text-[#083002]/60 dark:text-green-200/60 font-semibold">
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
