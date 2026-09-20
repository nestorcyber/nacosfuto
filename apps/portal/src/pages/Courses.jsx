import React, { useState, useEffect, useMemo } from 'react';
import { Download, Search, FileText, ExternalLink, ChevronDown, Filter } from 'lucide-react';
import PortalLayout from '../components/PortalLayout';

const ALL_COURSES = [
  // 100 Level - 1st Semester
  { code: 'CSC 101', title: 'Introduction to Computing Systems', units: 3, lecturer: 'Dr. C. N. Nwokorie', notesCount: 7, pastQuestions: 6, levelNumber: 100, semesterNumber: 1 },
  { code: 'MTH 101', title: 'Elementary Mathematics I (Algebra & Trig)', units: 3, lecturer: 'Dr. E. O. Opara', notesCount: 5, pastQuestions: 8, levelNumber: 100, semesterNumber: 1 },
  { code: 'PHY 101', title: 'General Physics I (Mechanics)', units: 3, lecturer: 'Prof. B. C. Eze', notesCount: 6, pastQuestions: 7, levelNumber: 100, semesterNumber: 1 },
  { code: 'CHM 101', title: 'General Chemistry I', units: 3, lecturer: 'Dr. A. I. Onuegbu', notesCount: 4, pastQuestions: 5, levelNumber: 100, semesterNumber: 1 },
  { code: 'GST 101', title: 'Use of English I', units: 2, lecturer: 'Dr. (Mrs) U. C. Iwuchukwu', notesCount: 5, pastQuestions: 4, levelNumber: 100, semesterNumber: 1 },
  { code: 'PHY 107', title: 'General Physics Laboratory I', units: 1, lecturer: 'Dept. of Physics', notesCount: 3, pastQuestions: 3, levelNumber: 100, semesterNumber: 1 },
  { code: 'CHM 107', title: 'General Chemistry Laboratory I', units: 1, lecturer: 'Dept. of Chemistry', notesCount: 3, pastQuestions: 3, levelNumber: 100, semesterNumber: 1 },
  { code: 'BIO 101', title: 'General Biology I', units: 3, lecturer: 'Dr. P. C. Nwachukwu', notesCount: 4, pastQuestions: 4, levelNumber: 100, semesterNumber: 1 },

  // 100 Level - 2nd Semester
  { code: 'CSC 102', title: 'Introduction to Problem Solving & Programming', units: 3, lecturer: 'Dr. C. N. Nwokorie', notesCount: 8, pastQuestions: 7, levelNumber: 100, semesterNumber: 2 },
  { code: 'MTH 102', title: 'Elementary Mathematics II (Calculus)', units: 3, lecturer: 'Dr. E. O. Opara', notesCount: 6, pastQuestions: 9, levelNumber: 100, semesterNumber: 2 },
  { code: 'PHY 102', title: 'General Physics II (Electricity & Magnetism)', units: 3, lecturer: 'Prof. B. C. Eze', notesCount: 5, pastQuestions: 6, levelNumber: 100, semesterNumber: 2 },
  { code: 'CHM 102', title: 'General Chemistry II', units: 3, lecturer: 'Dr. A. I. Onuegbu', notesCount: 4, pastQuestions: 4, levelNumber: 100, semesterNumber: 2 },
  { code: 'GST 102', title: 'Use of English II', units: 2, lecturer: 'Dr. (Mrs) U. C. Iwuchukwu', notesCount: 4, pastQuestions: 4, levelNumber: 100, semesterNumber: 2 },
  { code: 'PHY 108', title: 'General Physics Laboratory II', units: 1, lecturer: 'Dept. of Physics', notesCount: 3, pastQuestions: 3, levelNumber: 100, semesterNumber: 2 },
  { code: 'CHM 108', title: 'General Chemistry Laboratory II', units: 1, lecturer: 'Dept. of Chemistry', notesCount: 3, pastQuestions: 3, levelNumber: 100, semesterNumber: 2 },
  { code: 'ENR 102', title: 'Engineering Drawing I', units: 2, lecturer: 'Engr. K. O. Okoro', notesCount: 4, pastQuestions: 5, levelNumber: 100, semesterNumber: 2 },

  // 200 Level - 1st Semester
  { code: 'CSC 201', title: 'Computer Programming I (C++)', units: 3, lecturer: 'Dr. G. A. Chukwudebe', notesCount: 7, pastQuestions: 8, levelNumber: 200, semesterNumber: 1 },
  { code: 'CSC 203', title: 'Discrete Structures', units: 3, lecturer: 'Prof. F. E. Onuodu', notesCount: 6, pastQuestions: 6, levelNumber: 200, semesterNumber: 1 },
  { code: 'MTH 201', title: 'Mathematical Methods I', units: 3, lecturer: 'Dr. N. C. Ihedioha', notesCount: 5, pastQuestions: 7, levelNumber: 200, semesterNumber: 1 },
  { code: 'PHY 201', title: 'Modern Physics', units: 3, lecturer: 'Prof. B. C. Eze', notesCount: 4, pastQuestions: 5, levelNumber: 200, semesterNumber: 1 },
  { code: 'STA 211', title: 'Probability & Statistics I', units: 3, lecturer: 'Dr. S. A. Amadi', notesCount: 5, pastQuestions: 6, levelNumber: 200, semesterNumber: 1 },
  { code: 'GST 201', title: 'Nigerian Peoples and Culture', units: 2, lecturer: 'Directorate of General Studies', notesCount: 4, pastQuestions: 4, levelNumber: 200, semesterNumber: 1 },
  { code: 'EEE 201', title: 'Applied Electricity I', units: 3, lecturer: 'Engr. D. C. Stanley', notesCount: 5, pastQuestions: 5, levelNumber: 200, semesterNumber: 1 },

  // 200 Level - 2nd Semester
  { code: 'CSC 202', title: 'Computer Programming II (Java)', units: 3, lecturer: 'Dr. G. A. Chukwudebe', notesCount: 8, pastQuestions: 8, levelNumber: 200, semesterNumber: 2 },
  { code: 'CSC 204', title: 'Fundamentals of Data Processing', units: 2, lecturer: 'Dr. I. C. Obidike', notesCount: 5, pastQuestions: 5, levelNumber: 200, semesterNumber: 2 },
  { code: 'CSC 206', title: 'Discrete Mathematics for Computing', units: 3, lecturer: 'Prof. F. E. Onuodu', notesCount: 6, pastQuestions: 6, levelNumber: 200, semesterNumber: 2 },
  { code: 'MTH 202', title: 'Mathematical Methods II', units: 3, lecturer: 'Dr. N. C. Ihedioha', notesCount: 6, pastQuestions: 7, levelNumber: 200, semesterNumber: 2 },
  { code: 'PHY 202', title: 'Electric Circuits & Electronics', units: 3, lecturer: 'Engr. D. C. Stanley', notesCount: 5, pastQuestions: 6, levelNumber: 200, semesterNumber: 2 },
  { code: 'STA 212', title: 'Statistics for Physical Sciences', units: 3, lecturer: 'Dr. S. A. Amadi', notesCount: 4, pastQuestions: 5, levelNumber: 200, semesterNumber: 2 },
  { code: 'GST 222', title: 'Peace & Conflict Studies', units: 2, lecturer: 'Directorate of General Studies', notesCount: 3, pastQuestions: 4, levelNumber: 200, semesterNumber: 2 },

  // 300 Level - 1st Semester
  { code: 'CSC 301', title: 'Structured Programming (C++)', units: 3, lecturer: 'Dr. C. N. Nwokorie', notesCount: 6, pastQuestions: 5, levelNumber: 300, semesterNumber: 1 },
  { code: 'CSC 303', title: 'Data Structures & Algorithms', units: 3, lecturer: 'Prof. F. E. Onuodu', notesCount: 8, pastQuestions: 7, levelNumber: 300, semesterNumber: 1 },
  { code: 'CSC 305', title: 'Operating Systems & Architecture', units: 3, lecturer: 'Dr. G. A. Chukwudebe', notesCount: 5, pastQuestions: 6, levelNumber: 300, semesterNumber: 1 },
  { code: 'CSC 307', title: 'Object-Oriented Analysis & Design', units: 3, lecturer: 'Engr. D. C. Stanley', notesCount: 4, pastQuestions: 4, levelNumber: 300, semesterNumber: 1 },
  { code: 'CSC 309', title: 'Database Design & Relational Models', units: 2, lecturer: 'Dr. N. C. Ihedioha', notesCount: 7, pastQuestions: 8, levelNumber: 300, semesterNumber: 1 },
  { code: 'MTH 311', title: 'Numerical Analysis & Methods', units: 3, lecturer: 'Dr. E. O. Opara', notesCount: 4, pastQuestions: 9, levelNumber: 300, semesterNumber: 1 },
  { code: 'ENS 301', title: 'Entrepreneurship & Innovation', units: 2, lecturer: 'Centre for Entrepreneurship', notesCount: 3, pastQuestions: 3, levelNumber: 300, semesterNumber: 1 },
  { code: 'CSC 313', title: 'Compiler Construction Fundamentals', units: 2, lecturer: 'Dr. I. C. Obidike', notesCount: 5, pastQuestions: 4, levelNumber: 300, semesterNumber: 1 },

  // 300 Level - 2nd Semester
  { code: 'CSC 302', title: 'Operating Systems Principles', units: 3, lecturer: 'Dr. G. A. Chukwudebe', notesCount: 6, pastQuestions: 6, levelNumber: 300, semesterNumber: 2 },
  { code: 'CSC 304', title: 'Software Engineering Foundations', units: 3, lecturer: 'Engr. D. C. Stanley', notesCount: 7, pastQuestions: 7, levelNumber: 300, semesterNumber: 2 },
  { code: 'CSC 306', title: 'Automata Theory & Formal Languages', units: 3, lecturer: 'Prof. F. E. Onuodu', notesCount: 5, pastQuestions: 5, levelNumber: 300, semesterNumber: 2 },
  { code: 'CSC 308', title: 'Web Technologies & Internet Programming', units: 3, lecturer: 'Tech Director (NACOS)', notesCount: 8, pastQuestions: 6, levelNumber: 300, semesterNumber: 2 },
  { code: 'CSC 310', title: 'Computer Architecture & Microprocessors', units: 3, lecturer: 'Dr. I. C. Obidike', notesCount: 5, pastQuestions: 5, levelNumber: 300, semesterNumber: 2 },
  { code: 'CSC 312', title: 'Systems Analysis and Design', units: 3, lecturer: 'Dr. N. C. Ihedioha', notesCount: 6, pastQuestions: 6, levelNumber: 300, semesterNumber: 2 },

  // 400 Level - 1st Semester
  { code: 'CSC 401', title: 'Technical Research Methodology', units: 2, lecturer: 'Prof. F. E. Onuodu', notesCount: 5, pastQuestions: 4, levelNumber: 400, semesterNumber: 1 },
  { code: 'CSC 403', title: 'Computer Networks & Security', units: 3, lecturer: 'Dr. G. A. Chukwudebe', notesCount: 7, pastQuestions: 7, levelNumber: 400, semesterNumber: 1 },
  { code: 'CSC 405', title: 'Software Engineering Methodologies', units: 3, lecturer: 'Engr. D. C. Stanley', notesCount: 6, pastQuestions: 6, levelNumber: 400, semesterNumber: 1 },
  { code: 'CSC 407', title: 'Computer Graphics & Visualization', units: 3, lecturer: 'Dr. C. N. Nwokorie', notesCount: 6, pastQuestions: 5, levelNumber: 400, semesterNumber: 1 },
  { code: 'CSC 409', title: 'Database Management Systems Implementation', units: 3, lecturer: 'Dr. N. C. Ihedioha', notesCount: 7, pastQuestions: 6, levelNumber: 400, semesterNumber: 1 },

  // 400 Level - 2nd Semester
  { code: 'CSC 410', title: 'Students Industrial Work Experience Scheme (SIWES)', units: 6, lecturer: 'SIWES Unit & Dept. Supervisors', notesCount: 4, pastQuestions: 3, levelNumber: 400, semesterNumber: 2 },

  // 500 Level - 1st Semester
  { code: 'CSC 501', title: 'Artificial Intelligence & Expert Systems', units: 3, lecturer: 'Dr. (Mrs) N. C. Daniel', notesCount: 8, pastQuestions: 7, levelNumber: 500, semesterNumber: 1 },
  { code: 'CSC 503', title: 'Distributed Computing Architecture', units: 3, lecturer: 'Dr. G. A. Chukwudebe', notesCount: 6, pastQuestions: 6, levelNumber: 500, semesterNumber: 1 },
  { code: 'CSC 505', title: 'Cryptography & Information Security', units: 3, lecturer: 'Prof. F. E. Onuodu', notesCount: 7, pastQuestions: 6, levelNumber: 500, semesterNumber: 1 },
  { code: 'CSC 507', title: 'Cloud Computing & Virtualization', units: 3, lecturer: 'Engr. D. C. Stanley', notesCount: 6, pastQuestions: 5, levelNumber: 500, semesterNumber: 1 },
  { code: 'CSC 509', title: 'Machine Learning & Neural Networks', units: 3, lecturer: 'Dr. C. N. Nwokorie', notesCount: 8, pastQuestions: 7, levelNumber: 500, semesterNumber: 1 },

  // 500 Level - 2nd Semester
  { code: 'CSC 502', title: 'Mobile Application Development', units: 3, lecturer: 'Tech Director (NACOS)', notesCount: 7, pastQuestions: 6, levelNumber: 500, semesterNumber: 2 },
  { code: 'CSC 504', title: 'Advanced Computer Algorithms', units: 3, lecturer: 'Prof. F. E. Onuodu', notesCount: 6, pastQuestions: 6, levelNumber: 500, semesterNumber: 2 },
  { code: 'CSC 599', title: 'Independent Capstone Project / Thesis', units: 6, lecturer: 'Departmental Project Committee', notesCount: 5, pastQuestions: 4, levelNumber: 500, semesterNumber: 2 },
];

const PAST_QUESTIONS = [
  { id: 1, course: 'CSC 101', session: '2023/2024 Exam & Test Bundle', file: 'CSC101_2023_2024_PastQuestions.pdf', size: '2.1 MB', downloads: 410, levelNumber: 100, semesterNumber: 1 },
  { id: 2, course: 'CSC 102', session: '2022–2024 Past Questions with Solutions', file: 'CSC102_Solved_PastQuestions.pdf', size: '3.4 MB', downloads: 380, levelNumber: 100, semesterNumber: 2 },
  { id: 3, course: 'CSC 201', session: '2022–2024 Exam & Mid-Term Solutions', file: 'CSC201_Comprehensive_Pack.pdf', size: '3.6 MB', downloads: 490, levelNumber: 200, semesterNumber: 1 },
  { id: 4, course: 'CSC 202', session: '2023/2024 Java Exam & Test Papers', file: 'CSC202_Java_PastQuestions.pdf', size: '3.1 MB', downloads: 460, levelNumber: 200, semesterNumber: 2 },
  { id: 5, course: 'CSC 301', session: '2023/2024 Exam & Test Bundle', file: 'CSC301_2023_2024_PastQuestions.pdf', size: '2.4 MB', downloads: 340, levelNumber: 300, semesterNumber: 1 },
  { id: 6, course: 'CSC 303', session: '2022–2024 Past Questions with Solutions', file: 'CSC303_Solved_PastQuestions.pdf', size: '4.1 MB', downloads: 512, levelNumber: 300, semesterNumber: 1 },
  { id: 7, course: 'CSC 305', session: '2019–2024 Mid-Semester Tests & Finals', file: 'CSC305_Comprehensive_Pack.pdf', size: '3.8 MB', downloads: 289, levelNumber: 300, semesterNumber: 1 },
  { id: 8, course: 'CSC 309', session: 'Database SQL Practical Past Exam Papers', file: 'CSC309_SQL_Exam_Packs.pdf', size: '1.9 MB', downloads: 418, levelNumber: 300, semesterNumber: 1 },
  { id: 9, course: 'MTH 311', session: 'Numerical Methods Worked Solutions 2018–2023', file: 'MTH311_Worked_Solutions.pdf', size: '5.2 MB', downloads: 620, levelNumber: 300, semesterNumber: 1 },
  { id: 10, course: 'CSC 403', session: 'Computer Networks & Security Past Exams', file: 'CSC403_Networks_Pack.pdf', size: '4.2 MB', downloads: 295, levelNumber: 400, semesterNumber: 1 },
  { id: 11, course: 'CSC 501', session: 'AI & Neural Networks Past Exam Solutions', file: 'CSC501_AI_Solutions.pdf', size: '4.8 MB', downloads: 310, levelNumber: 500, semesterNumber: 1 },
];

const Courses = () => {
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('nacos_user');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {}
      }
    }
    return {};
  });

  const [activeTab, setActiveTab] = useState('courses');
  const [searchTerm, setSearchTerm] = useState('');

  // Determine current student level (e.g. 100, 200, 300, 400, 500)
  const currentLevel = useMemo(() => {
    const levelStr = (user.level || '').toString();
    const match = levelStr.match(/(\d{3})/);
    if (match) {
      return parseInt(match[1], 10);
    }
    if (levelStr.toLowerCase().includes('alumni') || levelStr.toLowerCase().includes('graduated')) {
      return 500;
    }
    if (user.role && (user.role.toLowerCase().includes('admin') || user.role.toLowerCase().includes('president'))) {
      return 500;
    }
    if (user.admission_year) {
      const num = 2026 - parseInt(user.admission_year, 10) + 1;
      if (num >= 5) return 500;
      if (num <= 1) return 100;
      return num * 100;
    }
    return 300; // default fallback
  }, [user]);

  // By default, filter sets to current level & current semester (e.g. "300-1" or "500-1")
  const [selectedFilter, setSelectedFilter] = useState(() => `${currentLevel}-1`);
  const [hasUserChangedFilter, setHasUserChangedFilter] = useState(false);

  useEffect(() => {
    const handleUserUpdate = () => {
      const stored = localStorage.getItem('nacos_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {}
      }
    };
    handleUserUpdate();
    window.addEventListener('storage', handleUserUpdate);
    window.addEventListener('nacos_user_updated', handleUserUpdate);
    return () => {
      window.removeEventListener('storage', handleUserUpdate);
      window.removeEventListener('nacos_user_updated', handleUserUpdate);
    };
  }, []);

  // Update default filter when current level resolves, unless user explicitly selected another option
  useEffect(() => {
    if (!hasUserChangedFilter) {
      setSelectedFilter(`${currentLevel}-1`);
    }
  }, [currentLevel, hasUserChangedFilter]);

  // Available levels strictly up to the student's current level
  const availableLevels = useMemo(() => {
    const levels = [100, 200, 300, 400, 500];
    return levels.filter(lvl => lvl <= currentLevel);
  }, [currentLevel]);

  // Filter registered courses
  const filteredCourses = useMemo(() => {
    return ALL_COURSES.filter(c => {
      // Must not exceed student's current level
      if (c.levelNumber > currentLevel) return false;

      // Single combined filter
      if (selectedFilter !== 'all') {
        const [lvlStr, semStr] = selectedFilter.split('-');
        if (lvlStr && c.levelNumber.toString() !== lvlStr) return false;
        if (semStr && semStr !== 'all' && c.semesterNumber.toString() !== semStr) return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchCode = c.code.toLowerCase().includes(query);
        const matchTitle = c.title.toLowerCase().includes(query);
        const matchLecturer = c.lecturer.toLowerCase().includes(query);
        if (!matchCode && !matchTitle && !matchLecturer) return false;
      }

      return true;
    });
  }, [currentLevel, selectedFilter, searchTerm]);

  // Filter past questions
  const filteredPQs = useMemo(() => {
    return PAST_QUESTIONS.filter(pq => {
      // Must not exceed student's current level
      if (pq.levelNumber > currentLevel) return false;

      // Single combined filter
      if (selectedFilter !== 'all') {
        const [lvlStr, semStr] = selectedFilter.split('-');
        if (lvlStr && pq.levelNumber.toString() !== lvlStr) return false;
        if (semStr && semStr !== 'all' && pq.semesterNumber.toString() !== semStr) return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchCourse = pq.course.toLowerCase().includes(query);
        const matchSession = pq.session.toLowerCase().includes(query);
        if (!matchCourse && !matchSession) return false;
      }

      return true;
    });
  }, [currentLevel, selectedFilter, searchTerm]);

  return (
    <PortalLayout>
      <div className="space-y-5">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Course Registration & Past Questions
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-green-200/80 font-normal mt-1">
              Registered semester course modules, lecture slides, and past questions up to your current level ({currentLevel} Level).
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 dark:text-green-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search course code, title or lecturer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-green-200/50 focus:outline-none focus:ring-1 focus:ring-[#138601] w-full sm:w-72 font-normal shadow-xs"
            />
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex space-x-2 border-b border-gray-200 dark:border-[#138601]/25 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'courses'
                ? 'bg-[#138601] text-white shadow-xs'
                : 'text-gray-600 dark:text-green-200 hover:text-gray-900 dark:hover:text-white hover:bg-[#f1f3f5] dark:hover:bg-[#083002]'
            }`}
          >
            Registered Courses ({filteredCourses.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pq')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'pq'
                ? 'bg-[#138601] text-white shadow-xs'
                : 'text-gray-600 dark:text-green-200 hover:text-gray-900 dark:hover:text-white hover:bg-[#f1f3f5] dark:hover:bg-[#083002]'
            }`}
          >
            Past Questions Archive ({filteredPQs.length})
          </button>
        </div>

        {/* Single Filter Box - Defaults to Current Semester & Level */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#083002] border border-gray-200/80 dark:border-[#138601]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400 dark:text-green-300 shrink-0" />
            <label className="text-xs font-semibold text-gray-700 dark:text-green-200 whitespace-nowrap">Filter Session / Semester:</label>
            <div className="relative">
              <select
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value);
                  setHasUserChangedFilter(true);
                }}
                className="appearance-none px-3.5 py-2 pr-8 text-xs rounded-lg bg-[#f8fafc] dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#138601] cursor-pointer min-w-[240px] sm:min-w-[280px]"
              >
                <option value="all">All Levels & Semesters (100L – {currentLevel}L)</option>
                {availableLevels.map((lvl) => (
                  <optgroup key={lvl} label={`${lvl} Level`} className="text-gray-900 dark:text-white bg-white dark:bg-[#083002]">
                    <option value={`${lvl}-all`}>{lvl} Level - All Semesters</option>
                    <option value={`${lvl}-1`}>
                      {lvl} Level - 1st Semester {lvl === currentLevel ? '(Current Level)' : ''}
                    </option>
                    <option value={`${lvl}-2`}>{lvl} Level - 2nd Semester</option>
                  </optgroup>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 dark:text-green-300 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-green-200/80 font-normal">
            <span>
              Showing <strong className="text-gray-900 dark:text-white">{activeTab === 'courses' ? filteredCourses.length : filteredPQs.length}</strong> {activeTab === 'courses' ? 'courses' : 'past questions'}
            </span>
            {(selectedFilter !== `${currentLevel}-1` || searchTerm) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedFilter(`${currentLevel}-1`);
                  setHasUserChangedFilter(false);
                  setSearchTerm('');
                }}
                className="text-[#138601] dark:text-[#4bd043] font-semibold hover:underline ml-1 cursor-pointer"
              >
                Reset to Current Semester
              </button>
            )}
          </div>
        </div>

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          filteredCourses.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-[#083002] border border-gray-200/80 dark:border-[#138601]/30 text-center space-y-2 shadow-xs">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">No courses match your filter criteria.</p>
              <p className="text-xs text-gray-500 dark:text-green-200/80">Try selecting a different level/semester or resetting the filter.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedFilter(`${currentLevel}-1`);
                  setHasUserChangedFilter(false);
                  setSearchTerm('');
                }}
                className="mt-2 inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] transition-colors cursor-pointer"
              >
                Reset to Current Semester
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCourses.map((course, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-[#083002] border border-gray-200/80 dark:border-[#138601]/30 hover:border-[#138601] dark:hover:border-[#138601] transition-all space-y-2.5 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">{course.code}</span>
                      <span className="text-[10px] sm:text-xs font-medium bg-[#f1f3f5] dark:bg-[#041801] text-gray-600 dark:text-green-200 px-2.5 py-0.5 rounded-full">
                        {course.levelNumber}L • Sem {course.semesterNumber}
                      </span>
                    </div>
                    <span className="text-xs font-semibold bg-[#ebf3ff] dark:bg-[#041801] text-[#138601] dark:text-[#4bd043] px-2.5 py-0.5 rounded-full">
                      {course.units} Credit Units
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">{course.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-green-200/80 mt-0.5 font-normal">Lecturer: {course.lecturer}</p>
                  </div>

                  <div className="pt-2.5 border-t border-gray-100 dark:border-[#138601]/20 flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-green-200/70 font-normal">{course.notesCount} lecture slides • {course.pastQuestions} past questions</span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#138601] dark:text-[#4bd043] hover:underline transition-colors cursor-pointer"
                    >
                      <span>View Module</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Past Questions Tab */}
        {activeTab === 'pq' && (
          filteredPQs.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-[#083002] border border-gray-200/80 dark:border-[#138601]/30 text-center space-y-2 shadow-xs">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">No past questions match your filter criteria.</p>
              <p className="text-xs text-gray-500 dark:text-green-200/80">Try selecting a different level/semester or resetting the filter.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedFilter(`${currentLevel}-1`);
                  setHasUserChangedFilter(false);
                  setSearchTerm('');
                }}
                className="mt-2 inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] transition-colors cursor-pointer"
              >
                Reset to Current Semester
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredPQs.map((pq) => (
                <div
                  key={pq.id}
                  className="p-4 rounded-xl bg-white dark:bg-[#083002] border border-gray-200/80 dark:border-[#138601]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-[#f1f3f5] dark:bg-[#041801] flex items-center justify-center text-[#138601] dark:text-[#4bd043] shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">{pq.course}</span>
                        <span className="text-[10px] sm:text-xs font-medium bg-[#f1f3f5] dark:bg-[#041801] text-gray-600 dark:text-green-200 px-2.5 py-0.5 rounded-full">
                          {pq.levelNumber}L • Sem {pq.semesterNumber}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-green-300 font-normal">({pq.size})</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-green-200/80 font-normal mt-0.5">{pq.session}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span className="text-xs text-gray-500 dark:text-green-200/70 font-normal">{pq.downloads} downloads</span>
                    <a
                      href={`/downloads/${pq.file}`}
                      download
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] transition-colors shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

      </div>
    </PortalLayout>
  );
};

export default Courses;
