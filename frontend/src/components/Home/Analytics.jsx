import React from 'react';
import { FaChartBar, FaUserShield, FaLock } from 'react-icons/fa';

import ScrollToTopLink from '../ScrollToTopLink';

const Analytics = () => {
  return (
    <section className="py-24 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            Secure <span className="text-green-600">Academic Records</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Our system ensures your academic records are securely stored and only accessible to authorized personnel.
            Students can view their results while lecturers and admin have appropriate access levels.
          </p>

          <div className="space-y-4">
            <div className="flex items-start">
              <FaUserShield className="text-green-500 mt-1 mr-3 text-xl" />
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">Role-Based Access</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Different access levels for students, lecturers, and admin with instant verification for new accounts.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <FaLock className="text-green-500 mt-1 mr-3 text-xl" />
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">Data Protection</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Your academic data is protected with industry-standard security measures.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center mb-4">
              <FaChartBar className="text-green-500 mr-2 text-2xl" />
              <h3 className="text-xl text-gray-600 font-semibold dark:text-white">Result Analytics</h3>
            </div>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              View detailed analytics of your academic performance over semesters.
            </p>
            <ScrollToTopLink to="/dashboard" className="inline-block w-full py-3 bg-green-600 hover:bg-green-700 text-white text-center rounded-lg font-bold transition-all shadow-md">
              View Your Dashboard
            </ScrollToTopLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analytics;