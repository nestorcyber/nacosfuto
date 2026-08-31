import React, { useEffect, useState } from 'react';
import Navbar from '../components/Nav/Navbar';
import Footer from '../components/Footer';
import { FiBook, FiFileText, FiVideo, FiExternalLink } from 'react-icons/fi';

const Resources = () => {
  const [activeFilter, setActiveFilter] = useState('All Resources');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'auto';
  }, []);

  const resources = [
    { id: 1, type: 'Book', title: 'Computer Organization & Architecture', author: 'Prof. Okonkwo', category: 'Books', code: 'CSC 401' },
    { id: 2, type: 'Handout', title: 'Data Structures & Algorithms in Java', author: 'Dr. Eze', category: 'Handouts', code: 'CSC 301' },
    { id: 3, type: 'Video', title: 'Algorithm Analysis & Complexity', author: 'Dr. Adeleke', category: 'Videos', code: 'CSC 402' },
    { id: 4, type: 'Book', title: 'Database Systems Design & Implementation', author: 'Prof. Musa', category: 'Books', code: 'CSC 403' },
    { id: 5, type: 'Handout', title: 'Modern Operating Systems Concepts', author: 'Dr. Okafor', category: 'Handouts', code: 'CSC 404' },
    { id: 6, type: 'Video', title: 'Computer Networks & TCP/IP Protocols', author: 'Prof. Bello', category: 'Videos', code: 'CSC 405' },
    { id: 7, type: 'Book', title: 'Software Engineering Principles', author: 'Dr. Ibrahim', category: 'Books', code: 'CSC 406' },
    { id: 8, type: 'Handout', title: 'Artificial Intelligence Fundamentals', author: 'Prof. Adebayo', category: 'Handouts', code: 'CSC 407' },
    { id: 9, type: 'Video', title: 'Cyber Security Essentials', author: 'Dr. Chukwu', category: 'Videos', code: 'CSC 408' },
    { id: 10, type: 'Book', title: 'Compiler Construction & Design', author: 'Prof. Onyema', category: 'Books', code: 'CSC 409' },
    { id: 11, type: 'Handout', title: 'Computer Graphics & Visualization', author: 'Dr. Nwachukwu', category: 'Handouts', code: 'CSC 410' },
    { id: 12, type: 'Video', title: 'Machine Learning with Python', author: 'Prof. Adeleke', category: 'Videos', code: 'CSC 411' },
  ];

  const filteredResources = activeFilter === 'All Resources' 
    ? resources 
    : resources.filter(resource => resource.category === activeFilter);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#041801] text-[#083002] dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-[#138601]/20 dark:border-[#138601]/30">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f2fbf1] dark:bg-[#083002] border border-[#138601]/30 text-[#138601] dark:text-[#4bd043] text-xs font-bold uppercase tracking-wider mb-3">
              STUDY VAULT
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#083002] dark:text-white">
              Learning & Academic Resources
            </h1>
            <p className="text-[#083002]/70 dark:text-green-100/70 mt-2 text-base">
              Curated course materials, textbooks, handouts, and video lectures.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {['All Resources', 'Books', 'Handouts', 'Videos'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                activeFilter === filter
                  ? 'bg-[#138601] text-white shadow-md shadow-[#138601]/30'
                  : 'bg-[#f2fbf1] dark:bg-[#083002] text-[#083002] dark:text-green-100 border border-[#138601]/20 dark:border-[#138601]/30 hover:bg-[#e2f7df]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-[#f8fdf7] dark:bg-[#083002] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:border-[#138601] dark:hover:border-[#4bd043] transition-all duration-300 border border-[#138601]/20 dark:border-[#138601]/30 flex flex-col justify-between"
            >
              <div className="h-44 bg-gradient-to-tr from-[#083002] via-[#0f6c01] to-[#138601] flex items-center justify-center text-white">
                {resource.type === 'Book' && <FiBook className="text-5xl opacity-90" />}
                {resource.type === 'Handout' && <FiFileText className="text-5xl opacity-90" />}
                {resource.type === 'Video' && <FiVideo className="text-5xl opacity-90" />}
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-extrabold text-[#138601] dark:text-[#4bd043] bg-white dark:bg-[#041801] px-3 py-1 rounded-md uppercase tracking-wider border border-[#138601]/20">
                      {resource.code}
                    </span>
                    <span className="text-xs text-[#083002]/70 dark:text-green-200/70 font-semibold">
                      {resource.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#083002] dark:text-white leading-snug">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-[#083002]/70 dark:text-green-100/70 mt-2">
                    Instructor: {resource.author}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#138601]/15 dark:border-white/10">
                  <a
                    href={import.meta.env.VITE_PORTAL_URL || "https://portal.futocsc.edu.ng"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#138601] hover:bg-[#0f6c01] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md shadow-[#138601]/30"
                  >
                    <span>Access on Portal</span>
                    <FiExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Resources;
