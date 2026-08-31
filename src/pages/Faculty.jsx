import React, { useEffect } from 'react';
import Navbar from '../components/Nav/Navbar';
import Footer from '../components/Footer';
import { FiBook, FiUser, FiMail } from 'react-icons/fi';

const Faculty = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'auto';
  }, []);

  const facultyMembers = [
    { name: 'Prof. S. O. Okonkwo', role: 'Head of Department', area: 'Software Engineering & AI', email: 'hod.csc@futo.edu.ng' },
    { name: 'Dr. C. C. Eze', role: 'Associate Professor', area: 'Data Structures & Algorithms', email: 'eze.csc@futo.edu.ng' },
    { name: 'Dr. M. A. Adeleke', role: 'Senior Lecturer', area: 'Machine Learning & Cyber Security', email: 'adeleke.csc@futo.edu.ng' },
    { name: 'Prof. A. I. Bello', role: 'Professor', area: 'Computer Networks & Distributed Systems', email: 'bello.csc@futo.edu.ng' },
    { name: 'Dr. F. O. Okafor', role: 'Senior Lecturer', area: 'Operating Systems & Cloud Architecture', email: 'okafor.csc@futo.edu.ng' },
    { name: 'Dr. K. N. Ibrahim', role: 'Lecturer I', area: 'Database Systems & Data Mining', email: 'ibrahim.csc@futo.edu.ng' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#041801] text-[#083002] dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-[#138601]/20 dark:border-[#138601]/30">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f2fbf1] dark:bg-[#083002] border border-[#138601]/30 text-[#138601] dark:text-[#4bd043] text-xs font-bold uppercase tracking-wider mb-3">
              ACADEMIC LEADERSHIP
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#083002] dark:text-white">
              Faculty Directory
            </h1>
            <p className="text-[#083002]/70 dark:text-green-100/70 mt-2 text-base">
              Meet the esteemed professors, lecturers, and researchers in the Computer Science Department.
            </p>
          </div>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {facultyMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-[#f8fdf7] dark:bg-[#083002] rounded-3xl p-7 shadow-md hover:shadow-2xl border border-[#138601]/20 dark:border-[#138601]/30 hover:border-[#138601] dark:hover:border-[#4bd043] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 bg-[#138601]/10 dark:bg-[#138601]/25 rounded-2xl flex items-center justify-center mb-5 border border-[#138601]/20">
                  <FiUser className="text-2xl text-[#138601] dark:text-[#4bd043]" />
                </div>
                <h3 className="text-xl font-bold text-[#083002] dark:text-white">
                  {member.name}
                </h3>
                <p className="text-sm font-bold text-[#138601] dark:text-[#4bd043] mt-1">
                  {member.role}
                </p>
                <div className="flex items-center gap-2 text-sm text-[#083002]/75 dark:text-green-100/75 mt-3">
                  <FiBook className="text-[#138601] flex-shrink-0" />
                  <span>{member.area}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#138601]/15 dark:border-white/10 flex items-center gap-2 text-sm text-[#083002]/70 dark:text-green-200/70">
                <FiMail className="flex-shrink-0 text-[#138601]" />
                <a href={`mailto:${member.email}`} className="hover:text-[#138601] dark:hover:text-[#4bd043] truncate font-medium">
                  {member.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Faculty;
