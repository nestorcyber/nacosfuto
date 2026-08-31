
import React from 'react';
import Navbar from '../components/Nav/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { FiCheckCircle, FiFileText, FiAward } from 'react-icons/fi';
import ScrollToTopLink from '../components/ScrollToTopLink';

const AdmissionRequirements = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar />
      <div className="flex-grow max-w-7xl mx-auto px-6 py-16 w-full">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
            Admission Requirements
          </h1>
          <p className="text-xl opacity-80 max-w-2xl mx-auto">
            Everything you need to know to join the Department of Computer Science at FUTO.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* UTME Requirements */}
          <div className={`p-8 rounded-3xl shadow-xl transition-all ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-2xl font-bold mb-6 flex items-center text-green-500">
               <FiAward className="mr-3" /> UTME Candidates
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FiCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span>Five O'Level credit passes in English Language, Mathematics, Physics, Chemistry, and any other science subject.</span>
              </li>
              <li className="flex items-start">
                <FiCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span>Minimum JAMB score of <strong>200</strong> (subject to annual change).</span>
              </li>
              <li className="flex items-start">
                <FiCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span>Correct JAMB subject combination: English, Mathematics, Physics, and Chemistry.</span>
              </li>
            </ul>
          </div>

          {/* Direct Entry */}
          <div className={`p-8 rounded-3xl shadow-xl transition-all ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-2xl font-bold mb-6 flex items-center text-blue-500">
               <FiFileText className="mr-3" /> Direct Entry
            </h2>
             <ul className="space-y-4">
              <li className="flex items-start">
                <FiCheckCircle className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
                <span>A-Level passes in Mathematics, Physics, and Chemistry.</span>
              </li>
              <li className="flex items-start">
                <FiCheckCircle className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
                <span>ND/HND with Upper Credit in Computer Science or related fields from a recognized institution.</span>
              </li>
               <li className="flex items-start">
                <FiCheckCircle className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
                <span>Five O'Level credit passes as specified for UTME candidates.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 text-center">
            <h3 className="text-xl font-bold mb-6">Ready to apply?</h3>
             <ScrollToTopLink to="/how-to-apply" className="px-8 py-3 bg-green-600 text-white rounded-full font-bold shadow-lg hover:bg-green-700 transition">
                See How to Apply
            </ScrollToTopLink>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdmissionRequirements;
