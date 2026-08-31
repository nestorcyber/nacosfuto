import React, { useEffect } from 'react';
import Navbar from '../components/Nav/Navbar';
import Footer from '../components/Footer';
import { FiBook, FiUser, FiMail } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const Faculty = () => {
  const { theme } = useTheme();

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
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              Faculty Directory
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-base">
              Meet the esteemed academic staff and researchers in the Computer Science Department.
            </p>
          </div>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {facultyMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mb-4">
                  <FiUser className="text-2xl text-green-700 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-1">
                  {member.role}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mt-3">
                  <FiBook className="text-gray-400 flex-shrink-0" />
                  <span>{member.area}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <FiMail className="flex-shrink-0" />
                <a href={`mailto:${member.email}`} className="hover:text-green-600 truncate">
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
