import React, { useState } from 'react';
import { Download, ChevronDown } from 'lucide-react';
import PortalLayout from '../components/PortalLayout';

const SEMESTERS = [
  {
    id: '300-1',
    level: '300 Level - 1st Semester (2024/2025)',
    gpa: '4.82',
    totalUnits: 21,
    courses: [
      { code: 'CSC 301', title: 'Structured Programming (C++)', units: 3, test: 26, exam: 58, score: 84, grade: 'A', gp: 15 },
      { code: 'CSC 303', title: 'Data Structures & Algorithms', units: 3, test: 24, exam: 55, score: 79, grade: 'A', gp: 15 },
      { code: 'CSC 305', title: 'Operating Systems & Architecture', units: 3, test: 22, exam: 50, score: 72, grade: 'A', gp: 15 },
      { code: 'CSC 307', title: 'Object-Oriented Analysis & Design', units: 3, test: 21, exam: 48, score: 69, grade: 'B', gp: 12 },
      { code: 'CSC 309', title: 'Database Design & Relational Models', units: 2, test: 28, exam: 60, score: 88, grade: 'A', gp: 10 },
      { code: 'MTH 311', title: 'Numerical Analysis & Complex Analysis', units: 3, test: 23, exam: 53, score: 76, grade: 'A', gp: 15 },
      { code: 'ENS 301', title: 'Entrepreneurship & Innovation', units: 2, test: 25, exam: 52, score: 77, grade: 'A', gp: 10 },
      { code: 'CSC 313', title: 'Compiler Construction Fundamentals', units: 2, test: 24, exam: 48, score: 72, grade: 'A', gp: 10 },
    ]
  },
  {
    id: '200-2',
    level: '200 Level - 2nd Semester (2023/2024)',
    gpa: '4.55',
    totalUnits: 20,
    courses: [
      { code: 'CSC 202', title: 'Computer Programming II (Java)', units: 3, test: 25, exam: 56, score: 81, grade: 'A', gp: 15 },
      { code: 'CSC 204', title: 'Fundamentals of Data Processing', units: 2, test: 22, exam: 52, score: 74, grade: 'A', gp: 10 },
      { code: 'CSC 206', title: 'Discrete Mathematics for Computing', units: 3, test: 21, exam: 47, score: 68, grade: 'B', gp: 12 },
      { code: 'MTH 202', title: 'Mathematical Methods II', units: 3, test: 23, exam: 50, score: 73, grade: 'A', gp: 15 },
      { code: 'PHY 202', title: 'Electric Circuits & Electronics', units: 3, test: 24, exam: 49, score: 73, grade: 'A', gp: 15 },
      { code: 'STA 212', title: 'Statistics for Physical Sciences', units: 3, test: 20, exam: 46, score: 66, grade: 'B', gp: 12 },
      { code: 'GST 222', title: 'Peace & Conflict Studies', units: 2, test: 27, exam: 54, score: 81, grade: 'A', gp: 10 },
    ]
  }
];

const Results = () => {
  const [selectedSemester, setSelectedSemester] = useState(SEMESTERS[0]);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      window.print();
    }, 400);
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Semester Result Checker
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-green-200/80 font-normal mt-0.5">
              Official semester grades, quality points, and cumulative CGPA standings.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Preparing Statement...' : 'Download Statement (PDF)'}</span>
          </button>
        </div>

        {/* CGPA Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 sm:p-5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 space-y-1.5">
            <span className="text-xs font-semibold text-gray-500 dark:text-green-200/80">Cumulative CGPA</span>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">4.62 <span className="text-xs text-gray-400 dark:text-green-300 font-normal">/ 5.00</span></div>
            <div className="text-xs text-[#138601] dark:text-[#4bd043] font-medium">First Class Standing</div>
          </div>

          <div className="p-4 sm:p-5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 space-y-1.5">
            <span className="text-xs font-semibold text-gray-500 dark:text-green-200/80">Selected Semester GPA</span>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-[#4bd043]">{selectedSemester.gpa} <span className="text-xs text-gray-400 dark:text-green-300 font-normal">/ 5.00</span></div>
            <div className="text-xs text-gray-500 dark:text-green-200/70 font-normal">{selectedSemester.totalUnits} Credit Units</div>
          </div>

          <div className="p-4 sm:p-5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 space-y-1.5">
            <span className="text-xs font-semibold text-gray-500 dark:text-green-200/80">Total Units Earned</span>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">88 <span className="text-xs text-gray-400 dark:text-green-300 font-normal">Units</span></div>
            <div className="text-xs text-[#138601] dark:text-[#4bd043] font-medium">0 Outstanding Deficiencies</div>
          </div>
        </div>

        {/* Semester Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-gray-700 dark:text-green-200">Select Academic Semester:</label>
          <div className="relative">
            <select
              value={selectedSemester.id}
              onChange={(e) => {
                const found = SEMESTERS.find(s => s.id === e.target.value);
                if (found) setSelectedSemester(found);
              }}
              className="appearance-none px-3.5 py-2 pr-9 text-xs rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#138601] cursor-pointer"
            >
              {SEMESTERS.map((sem) => (
                <option key={sem.id} value={sem.id}>{sem.level}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-green-300 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Results Table */}
        <div className="rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-[#138601]/25 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">{selectedSemester.level}</h3>
              <p className="text-xs text-gray-500 dark:text-green-200/80 font-normal">Department of Computer Science • Course Grade Points</p>
            </div>
            <span className="text-xs font-semibold text-gray-900 dark:text-[#4bd043] bg-[#f1f3f5] dark:bg-[#041801] px-2.5 py-1 rounded">
              GPA: {selectedSemester.gpa}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] dark:bg-[#041801]/60 text-gray-600 dark:text-green-200 font-semibold border-b border-gray-200 dark:border-[#138601]/30">
                <tr>
                  <th className="p-3">Course Code</th>
                  <th className="p-3">Course Description</th>
                  <th className="p-3 text-center">Units</th>
                  <th className="p-3 text-center">Test (30)</th>
                  <th className="p-3 text-center">Exam (70)</th>
                  <th className="p-3 text-center">Total (100)</th>
                  <th className="p-3 text-center">Grade</th>
                  <th className="p-3 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#138601]/15 font-normal">
                {selectedSemester.courses.map((course, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/70 dark:hover:bg-[#041801]/40 transition-colors">
                    <td className="p-3 font-semibold text-gray-900 dark:text-white">{course.code}</td>
                    <td className="p-3 text-gray-600 dark:text-green-100">{course.title}</td>
                    <td className="p-3 text-center text-gray-600 dark:text-green-100">{course.units}</td>
                    <td className="p-3 text-center text-gray-600 dark:text-green-100">{course.test}</td>
                    <td className="p-3 text-center text-gray-600 dark:text-green-100">{course.exam}</td>
                    <td className="p-3 text-center font-semibold text-gray-900 dark:text-white">{course.score}%</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        course.grade === 'A' ? 'bg-[#ebf3ff] text-[#138601] dark:bg-[#138601]/30 dark:text-[#4bd043]' : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        {course.grade}
                      </span>
                    </td>
                    <td className="p-3 text-right font-semibold text-gray-900 dark:text-white">{course.gp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </PortalLayout>
  );
};

export default Results;
