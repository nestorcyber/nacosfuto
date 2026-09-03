import React, { useState } from 'react';
import { Download, Search, FileText, ExternalLink } from 'lucide-react';
import PortalLayout from '../components/PortalLayout';

const REGISTERED_COURSES = [
  { code: 'CSC 301', title: 'Structured Programming (C++)', units: 3, lecturer: 'Dr. C. N. Nwokorie', notesCount: 6, pastQuestions: 5 },
  { code: 'CSC 303', title: 'Data Structures & Algorithms', units: 3, lecturer: 'Prof. F. E. Onuodu', notesCount: 8, pastQuestions: 7 },
  { code: 'CSC 305', title: 'Operating Systems & Architecture', units: 3, lecturer: 'Dr. G. A. Chukwudebe', notesCount: 5, pastQuestions: 6 },
  { code: 'CSC 307', title: 'Object-Oriented Analysis & Design', units: 3, lecturer: 'Engr. D. C. Stanley', notesCount: 4, pastQuestions: 4 },
  { code: 'CSC 309', title: 'Database Design & Relational Models', units: 2, lecturer: 'Dr. N. C. Ihedioha', notesCount: 7, pastQuestions: 8 },
  { code: 'MTH 311', title: 'Numerical Analysis & Methods', units: 3, lecturer: 'Dr. E. O. Opara', notesCount: 4, pastQuestions: 9 },
  { code: 'ENS 301', title: 'Entrepreneurship & Innovation', units: 2, lecturer: 'Centre for Entrepreneurship', notesCount: 3, pastQuestions: 3 },
  { code: 'CSC 313', title: 'Compiler Construction Fundamentals', units: 2, lecturer: 'Dr. I. C. Obidike', notesCount: 5, pastQuestions: 4 },
];

const PAST_QUESTIONS = [
  { id: 1, course: 'CSC 301', session: '2023/2024 Exam & Test Bundle', file: 'CSC301_2023_2024_PastQuestions.pdf', size: '2.4 MB', downloads: 340 },
  { id: 2, course: 'CSC 303', session: '2022–2024 Past Questions with Solutions', file: 'CSC303_Solved_PastQuestions.pdf', size: '4.1 MB', downloads: 512 },
  { id: 3, course: 'CSC 305', session: '2019–2024 Mid-Semester Tests & Finals', file: 'CSC305_Comprehensive_Pack.pdf', size: '3.8 MB', downloads: 289 },
  { id: 4, course: 'CSC 309', session: 'Database SQL Practical Past Exam Papers', file: 'CSC309_SQL_Exam_Packs.pdf', size: '1.9 MB', downloads: 418 },
  { id: 5, course: 'MTH 311', session: 'Numerical Methods Worked Solutions 2018–2023', file: 'MTH311_Worked_Solutions.pdf', size: '5.2 MB', downloads: 620 },
];

const Courses = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = REGISTERED_COURSES.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPQs = PAST_QUESTIONS.filter(pq => 
    pq.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pq.session.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PortalLayout>
      <div className="space-y-6">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Course Registration & Past Questions
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-green-200/80 font-normal mt-0.5">
              Registered semester course modules, lecture slides, and past question archive.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 dark:text-green-300 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search course code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-green-200/50 focus:outline-none focus:ring-1 focus:ring-[#138601] w-full sm:w-60 font-normal"
            />
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex space-x-2 border-b border-gray-200 dark:border-[#138601]/25 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'courses'
                ? 'bg-[#138601] text-white'
                : 'text-gray-600 dark:text-green-200 hover:text-gray-900 dark:hover:text-white hover:bg-[#f1f3f5] dark:hover:bg-[#083002]'
            }`}
          >
            Registered Courses (8)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pq')}
            className={`px-4 py-2 rounded text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'pq'
                ? 'bg-[#138601] text-white'
                : 'text-gray-600 dark:text-green-200 hover:text-gray-900 dark:hover:text-white hover:bg-[#f1f3f5] dark:hover:bg-[#083002]'
            }`}
          >
            Past Questions Archive
          </button>
        </div>

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCourses.map((course, idx) => (
              <div
                key={idx}
                className="p-5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 hover:border-gray-400 dark:hover:border-[#138601] transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-gray-900 dark:text-white">{course.code}</span>
                  <span className="text-xs font-semibold bg-[#ebf3ff] dark:bg-[#041801] text-[#138601] dark:text-[#4bd043] px-2 py-0.5 rounded">
                    {course.units} Credit Units
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{course.title}</h4>
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
        )}

        {/* Past Questions Tab */}
        {activeTab === 'pq' && (
          <div className="space-y-3">
            {filteredPQs.map((pq) => (
              <div
                key={pq.id}
                className="p-4 sm:p-5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded bg-[#f1f3f5] dark:bg-[#041801] flex items-center justify-center text-[#138601] dark:text-[#4bd043] shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-white text-sm">{pq.course}</span>
                      <span className="text-[11px] text-gray-500 dark:text-green-300 font-normal">({pq.size})</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-green-200/80 font-normal">{pq.session}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-xs text-gray-500 dark:text-green-200/70 font-normal">{pq.downloads} downloads</span>
                  <a
                    href={`/downloads/${pq.file}`}
                    download
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </PortalLayout>
  );
};

export default Courses;
