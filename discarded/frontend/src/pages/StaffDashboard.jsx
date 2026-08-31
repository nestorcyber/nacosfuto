import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import StaffSideNav from '../components/StaffSidenav';
import TopNav from '../components/TopNav';
import { FiBook, FiUsers, FiCheckSquare, FiLayers, FiBell } from 'react-icons/fi';
import courseImg from '../assets/courses.png';
import upcomingImg from '../assets/upcoming.png';
import facultyImg from '../assets/faculty.png';
import resourcesImg from '../assets/resources.png';
import useTheme from '../hooks/useTheme';
import NoAccessStaff from '../components/auth/NoAccessStaff';
import { useAnnouncements } from '../context/AnnouncementContext';


export default function StaffDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const { user, isLoggedIn, loading, fetchUserData } = useAuth();
  const { announcements, markAsRead } = useAnnouncements();

   useEffect(() => {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'auto'; // force-enable scroll
    }, []);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Additional protection - should theoretically never hit this due to ProtectedRoute
  if (!isLoggedIn || user.userType !== 'staff') {
    return <NoAccessStaff />; // ProtectedRoute will handle redirect
  }

   const stats = [
     { label: 'Courses', count: 10, icon: FiBook, img: courseImg },
     { label: 'Faculty', count: 15, icon: FiUsers, img: facultyImg },
     { label: 'Upcoming', count: 3, icon: FiCheckSquare, img: upcomingImg },
     { label: 'Resources', count: 10, icon: FiLayers, img: resourcesImg },
   ];

   // Dummy elections for testing
   const dummyElections = [
     {
       id: 1,
       title: 'Dummy Election 1',
       description: 'This is a dummy election for testing.',
       status: 'Open',
     },
     {
       id: 2,
       title: 'Dummy Election 2',
       description: 'Another dummy election.',
       status: 'Closed',
     },
   ];

   // Use dummy elections if user is dummy staff
   const displayElections = user?.id === 999 ? dummyElections : elections;
 
   return (
     <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
       <StaffSideNav
         isOpen={isSidebarOpen} 
         onClose={() => setIsSidebarOpen(false)} 
       />
       
       <TopNav 
         onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
         theme={theme}
         toggleTheme={toggleTheme}
       />
       
       <div className={`pt-16 transition-all duration-300 ${isSidebarOpen ? 'ml-0 md:ml-64' : 'ml-0 md:ml-64'}`}>
         {/* Welcome Section */}
         <div className="flex flex-col sm:flex-row justify-between mt-6 items-center px-6 py-4">
           <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
           <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
             Welcome to Computer Science Department
           </p>
         </div>
 
         {/* Stats Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
           {stats.map((item, idx) => (
             <div 
               key={idx} 
               className="flex items-center gap-4 border border-gray-200 dark:border-gray-700 p-6 rounded-lg hover:shadow-md dark:hover:shadow-gray-800/50 transition-all bg-white dark:bg-gray-800"
             >
               <img src={item.img} alt="" className="w-20 h-20 rounded-full object-cover" />
               <div className="flex-1 text-center">
                 <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">{item.label}</h2>
                 <p className="text-5xl font-bold mt-2 text-gray-900 dark:text-white">{item.count}</p>
               </div>
             </div>
           ))}
         </div>
 
         {/* Announcements and Quick Links */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 py-6">
           <div className="lg:col-span-2 border border-gray-200 dark:border-gray-700 p-6 rounded-lg bg-white dark:bg-gray-800">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center">
             <FiBell size={25} className="text-gray-700 dark:text-gray-300" />
              </div>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Announcements</h2>
            </div>
             <p className="text-sm mb-6 text-gray-600 dark:text-gray-300">Latest update from the department</p>
             <div className="space-y-4">
  {announcements.map(announcement => (
    <div 
      key={announcement.id} 
      className="border border-blue-500 dark:border-blue-600 p-4 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
      onClick={() => markAsRead(announcement.id)}
    >
      <h3 className="font-medium text-gray-900 dark:text-white">{announcement.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
        {announcement.content}
      </p>
      <p className="text-xs text-gray-500 mt-2">
        Posted by {announcement.first_name} {announcement.last_name} on {new Date(announcement.created_at).toLocaleDateString()}
      </p>
    </div>
  ))}
</div>
           </div>
 
           <div className="bg-green-700 dark:bg-green-800 p-6 rounded-tr-3xl rounded-bl-3xl text-white">
             <h2 className="text-3xl font-semibold text-black dark:text-white text-center">Quick Links</h2>
             <p className="mb-6 text-sm text-black dark:text-white text-center">Frequently used resources</p>
             <div className="flex flex-col space-y-4">
               {['Course Catalog', 'Faculty Directory', 'Learning Resources', 'Academic Calendar'].map((text, i) => (
                 <button 
                   key={i} 
                   className="bg-white dark:bg-gray-100 text-gray-900 flex items-center gap-3 p-3 rounded-md border border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-200 transition-colors"
                 >
                   <FiBook className="text-green-500 flex-shrink-0" />
                   <span className="text-left">{text}</span>
                 </button>
               ))}
             </div>
           </div>
         </div>
 
         {/* Featured Courses */}
         <div className="px-6 py-6">
           <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Featured Courses</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1, 2, 3].map(n => (
               <div 
                 key={n} 
                 className="bg-gray-100 dark:bg-gray-700 h-80 w-full rounded-lg shadow hover:shadow-md dark:hover:shadow-gray-600/50 transition-shadow flex items-center justify-center"
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

         {/* Elections Section - Dummy Data */}
         <div className="px-6 py-6">
           <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Elections</h2>
           {displayElections.length === 0 ? (
             <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
               <p className="text-gray-600 dark:text-gray-300">No elections available</p>
             </div>
           ) : (
             <div className="grid gap-6">
               {displayElections.map(election => (
                 <div key={election.id} className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg bg-white dark:bg-gray-800">
                   <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{election.title}</h3>
                   <p className="mt-2 text-gray-600 dark:text-gray-300">{election.description}</p>
                   <span className="text-xs text-gray-500">Status: {election.status}</span>
                 </div>
               ))}
             </div>
           )}
         </div>
       </div>
     </div>
   );
 }