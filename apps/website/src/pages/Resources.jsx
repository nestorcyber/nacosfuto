import React, { useState } from 'react';
import Navbar from '../components/Nav/Navbar';
import Footer from '../components/Footer';
import { FiBook, FiFileText, FiVideo, FiExternalLink } from 'react-icons/fi';

const Resources = () => {
  const [activeFilter, setActiveFilter] = useState('All Resources');

  const resourcesData = [
    { id: 1, title: 'Introduction to Problem Solving & C Programming', code: 'CSC 101', type: 'Handout', author: 'Dr. C. C. Nwokorie' },
    { id: 2, title: 'Data Structures and Algorithms in Python', code: 'CSC 201', type: 'Book', author: 'Prof. J. E. Stanley' },
    { id: 3, title: 'Object-Oriented Programming Video Series', code: 'CSC 203', type: 'Video', author: 'Prof. F. E. Onuodu' },
    { id: 4, title: 'Operating Systems Principles & Concurrency', code: 'CSC 301', type: 'Handout', author: 'Dr. M. I. Ezeh' },
    { id: 5, title: 'Artificial Intelligence & Neural Architectures', code: 'CSC 501', type: 'Book', author: 'Dr. (Mrs) N. C. Daniel' },
    { id: 6, title: 'Web Application Development with modern stacks', code: 'CSC 405', type: 'Video', author: 'Tech Director (NACOS)' }
  ];

  const filteredResources = activeFilter === 'All Resources'
    ? resourcesData
    : resourcesData.filter((r) => `${r.type}s` === activeFilter || r.type === activeFilter);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#041801] text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-[#138601]/20 dark:border-[#138601]/30">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded bg-[#f2fbf1] dark:bg-[#083002] border border-[#138601]/30 text-[#138601] dark:text-[#4bd043] text-xs font-bold uppercase tracking-wider mb-3">
              STUDY VAULT
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#083002] dark:text-white">
              Academic Resources & Study Hub
            </h1>
            <p className="text-sm text-[#083002]/70 dark:text-green-100/70 mt-1">
              Curated department handouts, lecture notes, textbook references, and tutorial archives.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          {['All Resources', 'Books', 'Handouts', 'Videos'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded font-semibold text-xs transition-colors cursor-pointer border ${
                activeFilter === filter
                  ? 'bg-[#138601] text-white border-[#138601] shadow-sm'
                  : 'bg-[#f2fbf1] dark:bg-[#083002] text-[#083002] dark:text-green-100 border-[#138601]/20 dark:border-[#138601]/30 hover:bg-[#e2f7df]'
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
              className="bg-[#f8fdf7] dark:bg-[#083002] rounded overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-[#138601]/20 dark:border-[#138601]/30 flex flex-col justify-between"
            >
              <div className="h-40 bg-[#083002] flex items-center justify-center text-white border-b border-[#138601]/20">
                {resource.type === 'Book' && <FiBook className="text-4xl text-[#4bd043]" />}
                {resource.type === 'Handout' && <FiFileText className="text-4xl text-[#4bd043]" />}
                {resource.type === 'Video' && <FiVideo className="text-4xl text-[#4bd043]" />}
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-xs font-bold text-[#138601] dark:text-[#4bd043] bg-white dark:bg-[#041801] px-2.5 py-0.5 rounded border border-[#138601]/20">
                      {resource.code}
                    </span>
                    <span className="text-xs text-[#083002]/70 dark:text-green-200/70 font-medium">
                      {resource.type}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#083002] dark:text-white leading-snug">
                    {resource.title}
                  </h3>
                  <p className="text-xs text-[#083002]/70 dark:text-green-100/70 mt-1.5">
                    Instructor: {resource.author}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#138601]/15 dark:border-white/10">
                  <a
                    href={import.meta.env.VITE_PORTAL_URL || "http://localhost:5174/courses"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-7 py-2.5 bg-[#138601] hover:bg-[#0f6c01] text-white font-semibold rounded text-sm transition-colors shadow-sm min-h-[42px]"
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
