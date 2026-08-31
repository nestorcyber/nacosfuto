import React, { useEffect } from 'react'
import { useState } from 'react';
import SideNav from '../components/Sidenav';
import TopNav from '../components/TopNav';
import { FiBook, FiUsers, FiCheckSquare, FiLayers, FiBell } from 'react-icons/fi';;
import useTheme from '../hooks/useTheme';
import { useAuth } from '../context/AuthContext';
import StaffSideNav from '../components/StaffSidenav';


const Results = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [theme, toggleTheme] = useTheme();
    const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'auto'; // force-enable scroll
  }, []);

    return (
      <>
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
              theme={theme}
              toggleTheme={toggleTheme}
            />

          <div className={`pt-16 transition-all duration-300 ${isSidebarOpen ? 'ml-0 md:ml-64' : 'ml-0 md:ml-64'}`}>
            {/* Welcome Section */}
         <div className="flex flex-col sm:flex-row justify-between mt-6 items-center px-6 py-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Results</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Computer Science Department
          </p>
        </div>

       
        
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
              <div 
                key={n} 
                style={{boxShadow: '5px 4px 4px 0px #00000040'
                }}
                className="bg-gray-100 dark:bg-gray-700 h-100 w-full rounded-lg shadow hover:shadow-md dark:hover:shadow-gray-600/50 transition-shadow flex items-center justify-center"
              >
                <div className="text-center p-4">
                  <FiBook className="mx-auto text-4xl text-gray-500 dark:text-gray-400 mb-3" />
                  <span className="text-gray-700 dark:text-gray-300 text-lg">Course {n}</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                   
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
      </>
    );
}

export default Results