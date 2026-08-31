import React, { useEffect, useState } from 'react';
import { FiBookOpen } from 'react-icons/fi';
import { courses } from '../components/CourseMaterials/CourseData';
import Filter from '../components/CourseMaterials/Filter';
import CourseTable from '../components/CourseMaterials/CourseTable';
import MaterialsModal from '../components/CourseMaterials/MaterialsModal';
import Navbar from '../components/Nav/Navbar';
import Footer from '../components/Footer';
import useTheme from '../hooks/useTheme';
import TopNav from '../components/TopNav';
import SideNav from '../components/Sidenav';
import { useAuth } from '../context/AuthContext';
import StaffSideNav from '../components/StaffSidenav';

const CourseMaterials = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showMaterialsModal, setShowMaterialsModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const { user } = useAuth();

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || course.level === parseInt(levelFilter);
    const matchesSemester = selectedSemester === 'all' || course.semester === parseInt(selectedSemester);
    
    return matchesSearch && matchesLevel && matchesSemester;
  });

  const handleMaterialClick = (course) => {
    setSelectedCourse(course);
    setShowMaterialsModal(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'auto'; // force-enable scroll
  }, []);

  return (
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
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              <FiBookOpen className="inline mr-2 text-green-600" />
              Computer Science Course Outlines
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Federal University of Technology, Owerri
            </p>
          </div>

          <Filter 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            levelFilter={levelFilter}
            setLevelFilter={setLevelFilter}
            selectedSemester={selectedSemester}
            setSelectedSemester={setSelectedSemester}
          />

          <CourseTable 
            filteredCourses={filteredCourses} 
            onMaterialClick={handleMaterialClick}
          />

          <div className="mt-8 bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg p-6 transition-colors duration-300">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              About Computer Science Courses at FUTO
            </h2>
            <div className="prose prose-green dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300">
                The Computer Science program at FUTO provides comprehensive
                knowledge in computing fundamentals and emerging technologies.
              </p>
            </div>
          </div>
        </div>
      </main>
    
      {showMaterialsModal && (
        <MaterialsModal
          course={selectedCourse}
          onClose={() => setShowMaterialsModal(false)}
        />
      )}

      <Footer />
    </div>
    </div>
  );
};

export default CourseMaterials;