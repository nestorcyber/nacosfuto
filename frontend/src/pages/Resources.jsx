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
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              Learning & Academic Resources
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-base">
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
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                activeFilter === filter
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col justify-between"
            >
              <div className="h-44 bg-gradient-to-tr from-green-800 to-emerald-600 flex items-center justify-center text-white">
                {resource.type === 'Book' && <FiBook className="text-5xl opacity-90" />}
                {resource.type === 'Handout' && <FiFileText className="text-5xl opacity-90" />}
                {resource.type === 'Video' && <FiVideo className="text-5xl opacity-90" />}
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/40 px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {resource.code}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {resource.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Instructor: {resource.author}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <a
                    href={import.meta.env.VITE_PORTAL_URL || "https://portal.futocsc.edu.ng"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-sm transition-colors"
                  >
                    <span>Access on Portal</span>
                    <FiExternalLink size={16} />
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
