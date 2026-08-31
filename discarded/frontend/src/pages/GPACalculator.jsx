import React, { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Nav/Navbar';
import { useNavigate } from 'react-router-dom';

// Course data organized by level and semester
const courseData = {
  100: {
    First: {
      MATH101: { units: 3, title: 'General Mathematics' },
      GST111: { units: 2, title: 'Use of English' },
      GST103: { units: 2, title: 'Philosophy & Logic' },
      COS101: { units: 3, title: 'Introduction to Computer Science' },
      STA111: { units: 3, title: 'Introduction to Statistics' }
    },
    Second: {
      PHY107: { units: 1, title: 'Experimental Physics' },
      CHM107: { units: 1, title: 'Experimental Chemistry' },
      PHY101: { units: 2, title: 'General Physics' },
      CHM101: { units: 2, title: 'General Chemistry' },
      BIO101: { units: 3, title: 'General Biology' }
    }
  },
  200: {
    First: {
      MTH201: { units: 2, title: 'Mathematical Methods I' },
      MTH203: { units: 2, title: 'Mathematical Methods II' },
      COS201: { units: 3, title: 'Data Structures' },
      COS203: { units: 3, title: 'Computer Architecture' },
      STA201: { units: 2, title: 'Probability Theory' }
    },
    Second: {
      COS202: { units: 3, title: 'Algorithms' },
      COS204: { units: 3, title: 'Operating Systems' },
      STA202: { units: 2, title: 'Statistical Inference' },
      ENG201: { units: 2, title: 'Technical Writing' },
      ENT201: { units: 2, title: 'Entrepreneurship' }
    }
  },
  
};

const gradePoints = [
  { grade: 'A', point: 5 },
  { grade: 'B', point: 4 },
  { grade: 'C', point: 3 },
  { grade: 'D', point: 2 },
  { grade: 'E', point: 1 },
  { grade: 'F', point: 0 }
];

export default function GPACalculator() {
  const { user, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [gpa, setGpa] = useState(null);
  const [cgpa, setCgpa] = useState(null);
  const [semester, setSemester] = useState('First');
  const [level, setLevel] = useState(user?.level || 100);
  const containerRef = useRef(null);

   useEffect(() => {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'auto'; // force-enable scroll
    }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, loading, navigate]);

  // Load saved data on mount
  useEffect(() => {
    const savedCourses = localStorage.getItem('gpa_calculator_courses');
    const savedGpa = localStorage.getItem('gpa_calculator_gpa');
    const savedCgpa = localStorage.getItem('gpa_calculator_cgpa');

    if (savedCourses) setCourses(JSON.parse(savedCourses));
    if (savedGpa) setGpa(savedGpa);
    if (savedCgpa) setCgpa(savedCgpa);
  }, []);

  // Initialize courses when level or semester changes (only if no saved data)
  useEffect(() => {
    const savedCourses = localStorage.getItem('gpa_calculator_courses');
    if (isLoggedIn && user?.userType === 'student' && !savedCourses) {
      const levelCourses = courseData[level]?.[semester] || {};
      const initialCourses = Object.keys(levelCourses).slice(0, 10).map(code => ({
        code,
        grade: 'A',
        units: levelCourses[code].units
      }));
      setCourses(initialCourses);
      setGpa(null);
      setCgpa(null);
    }
  }, [level, semester, isLoggedIn, user]);

  useGSAP(() => {
    if (!containerRef.current) return;
    
    gsap.from(containerRef.current.children, {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: "power2.out"
    });
  }, []);

  const addCourse = () => {
    if (courses.length >= 20) return;
    const levelCourses = courseData[level]?.[semester] || {};
    const availableCourses = Object.keys(levelCourses)
      .filter(code => !courses.some(c => c.code === code));
    
    if (availableCourses.length > 0) {
      const newCourses = [...courses, {
        code: availableCourses[0],
        grade: 'A',
        units: levelCourses[availableCourses[0]].units
      }];
      setCourses(newCourses);
      localStorage.setItem('gpa_calculator_courses', JSON.stringify(newCourses));
    }
  };

  const removeCourse = (index) => {
    const newCourses = courses.filter((_, i) => i !== index);
    setCourses(newCourses);
    localStorage.setItem('gpa_calculator_courses', JSON.stringify(newCourses));
  };

  const updateCourse = (index, field, value) => {
    const updatedCourses = [...courses];
    updatedCourses[index] = {
      ...updatedCourses[index],
      [field]: value,
      ...(field === 'code' && { 
        units: courseData[level]?.[semester]?.[value]?.units || 0 
      })
    };
    setCourses(updatedCourses);
    localStorage.setItem('gpa_calculator_courses', JSON.stringify(updatedCourses));
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalUnits = 0;

    courses.forEach(course => {
      const gradeObj = gradePoints.find(g => g.grade === course.grade);
      totalPoints += gradeObj.point * course.units;
      totalUnits += course.units;
    });

    const calculatedGPA = totalUnits ? (totalPoints / totalUnits).toFixed(2) : 0;
    setGpa(calculatedGPA);
    setCgpa(calculatedGPA); 
    localStorage.setItem('gpa_calculator_gpa', calculatedGPA);
    localStorage.setItem('gpa_calculator_cgpa', calculatedGPA);
    localStorage.setItem('gpa_calculator_courses', JSON.stringify(courses));
  };

  const resetCalculator = () => {
    localStorage.removeItem('gpa_calculator_courses');
    localStorage.removeItem('gpa_calculator_gpa');
    localStorage.removeItem('gpa_calculator_cgpa');
    
    const levelCourses = courseData[level]?.[semester] || {};
    const initialCourses = Object.keys(levelCourses).slice(0, 10).map(code => ({
      code,
      grade: 'A',
      units: levelCourses[code].units
    }));
    setCourses(initialCourses);
    setGpa(null);
    setCgpa(null);
  };

  if (loading || !isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const currentCourses = courseData[level]?.[semester] || {};

  return (
    <>
      <Navbar />
      <div ref={containerRef} className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="p-6 bg-green-600 dark:bg-green-700 text-white">
              <h1 className="text-2xl font-bold">GPA Calculator</h1>
              <p className="mt-1 text-green-100">
                {user?.userType === 'student' ? 
                  `${level} Level - ${semester} Semester` : 
                  'Staff GPA Calculator'}
              </p>
            </div>

            {/* Controls */}
            <div className="p-4 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <div className="flex flex-wrap gap-4">
                {user?.userType === 'student' && (
                  <>
                    <div className="flex-1 min-w-[150px]">
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Semester</label>
                      <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      >
                        <option value="First">Harmattam Semester</option>
                        <option value="Second">Rain Semester</option>
                      </select>
                    </div>
                    
                    <div className="flex-1 min-w-[150px]">
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Level</label>
                      <select
                        value={level}
                        onChange={(e) => setLevel(parseInt(e.target.value))}
                        className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      >
                        {[100, 200, 300, 400, 500].map(lvl => (
                          <option key={lvl} value={lvl}>{lvl} Level</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Courses Table */}
            <div className="p-4">
              <div className="overflow-x-auto">
                <div className="min-w-full inline-block align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                          {['Course', 'Title', 'Grade', 'Units', 'Action'].map((header) => (
                            <th 
                              key={header}
                              className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {courses.map((course, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <select
                                value={course.code}
                                onChange={(e) => updateCourse(index, 'code', e.target.value)}
                                className="w-full p-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                              >
                                {Object.keys(currentCourses).map(code => (
                                  <option key={code} value={code}>{code}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-gray-700 dark:text-gray-300">
                              {currentCourses[course.code]?.title || 'N/A'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <select
                                value={course.grade}
                                onChange={(e) => updateCourse(index, 'grade', e.target.value)}
                                className="w-full p-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                              >
                                {gradePoints.map(g => (
                                  <option key={g.grade} value={g.grade}>{g.grade}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center text-gray-700 dark:text-gray-300">
                              {course.units}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center">
                              <button
                                onClick={() => removeCourse(index)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={addCourse}
                  disabled={courses.length >= 20 || Object.keys(currentCourses).length <= courses.length}
                  className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
                    courses.length >= 15 || Object.keys(currentCourses).length <= courses.length ? 
                    'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Add Course (Max 20)
                </button>
                
                <button
                  onClick={calculateGPA}
                  disabled={courses.length === 0}
                  className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                    courses.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Calculate GPA
                </button>
                
                <button
                  onClick={resetCalculator}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Reset
                </button>
              </div>

              {/* Results */}
              {(gpa !== null || cgpa !== null) && (
                <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Results</h3>
                  {gpa !== null && (
                    <p className="mb-2 text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Semester GPA:</span> {gpa}
                    </p>
                  )}
                  {cgpa !== null && (
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Cumulative CGPA:</span> {cgpa}
                    </p>
                  )}
                </div>
              )}

              {/* Grading Scale */}
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Grading Scale</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {gradePoints.map((grade) => (
                    <div key={grade.grade} className="p-2 bg-white dark:bg-gray-800 rounded border dark:border-gray-700">
                      <span className="font-medium dark:text-white">{grade.grade}:</span> 
                      <span className="dark:text-gray-300"> {grade.point} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}