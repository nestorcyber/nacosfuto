import React, { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiEdit2, FiSave } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Nav/Navbar';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const detailsRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(user?.title || '');
  const [isCourseRep, setIsCourseRep] = useState(user?.is_course_rep || false);

   useEffect(() => {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'auto'; // force-enable scroll
    }, []);

  useGSAP(() => {
    if (!cardRef.current || !detailsRef.current) return;
    
    gsap.from(cardRef.current, {
      y: 50,
      opacity: 1,
      duration: 0.8,
      delay: 0.3,
      ease: "back.out(1.7)"
    });

    if (detailsRef.current?.children) {
      gsap.from(detailsRef.current.children, {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        delay: 0.6,
        duration: 0.5
      });
    }
  }, []);

  if (!user) {
    useEffect(() => {
      navigate('/login');
    }, [navigate]);
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const saveProfileChanges = () => {
    // Here you would typically make an API call to save changes
    setEditMode(false);
  };

  const getUserTitle = () => {
    if (user.userType === 'student') {
      return `${user.level} Level Student`;
    } else {
      if (isCourseRep) return 'Course Representative';
      if (title) return title;
      return 'Staff Member';
    }
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto">
        <div 
          ref={cardRef}
          className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl transform transition-all duration-500 hover:scale-[1.02]"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-green-500 to-teal-600 dark:from-green-600 dark:to-teal-700 p-6 sm:p-8 text-white relative">
            {user.userType === 'staff' && (
              <button 
                onClick={() => editMode ? saveProfileChanges() : setEditMode(true)}
                className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                {editMode ? <FiSave size={20} /> : <FiEdit2 size={20} />}
              </button>
            )}
            
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg">
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {user.first_name?.[0]}{user.last_name?.[0]}
                </span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {editMode && user.userType === 'staff' ? (
                    <select
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-white/20 border border-white/30 rounded px-2 py-1 text-white"
                    >
                      <option value="">Select Title</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Miss">Miss</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Prof.">Prof.</option>
                    </select>
                  ) : (
                    title ? `${title} ${user.first_name} ${user.middle_name || ''} ${user.last_name}` 
                    : `${user.first_name} ${user.middle_name || ''} ${user.last_name}`
                  )}
                </h1>
                <p className="text-green-100 dark:text-green-200">
                  {getUserTitle()}
                  {editMode && user.userType === 'staff' && (
                    <label className="ml-4 flex items-center">
                      <input
                        type="checkbox"
                        checked={isCourseRep}
                        onChange={(e) => setIsCourseRep(e.target.checked)}
                        className="mr-2"
                      />
                      Course Rep
                    </label>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div ref={detailsRef} className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailItem label="Email" value={user.official_email || user.email} />
            {user.reg_number && <DetailItem label="Registration Number" value={user.reg_number} />}
            {user.staff_id && <DetailItem label="Staff ID" value={user.staff_id} />}
            {user.level && <DetailItem label="Academic Level" value={`${user.level} Level`} />}
            {user.admission_year && (
              <DetailItem 
                label={user.userType === 'student' ? 'Admission Year' : 'Employment Year'} 
                value={user.admission_year-1} 
              />
            )}
            {user.department && <DetailItem label="Department" value={user.department} />}
            {user.is_course_rep && <DetailItem label="Role" value="Course Representative" />}
            
            <div className="md:col-span-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}