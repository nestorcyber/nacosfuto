import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  CreditCard, 
  BookOpen, 
  User, 
  ArrowUpRight, 
  CheckCircle, 
  TrendingUp,
} from 'lucide-react';
import PortalLayout from '../components/PortalLayout';

const Dashboard = () => {
  const [user, setUser] = useState({
    name: 'David Okonkwo',
    matric: '2022/139481',
    level: '300 Level',
    dept: 'Computer Science',
    cgpa: '4.62',
    duesPaid: true,
    regStatus: 'Completed'
  });

  useEffect(() => {
    const stored = localStorage.getItem('nacos_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <PortalLayout>
      <div className="space-y-6">
        
        {/* Welcome Banner */}
        <div className="p-6 sm:p-7 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30">
          <div className="max-w-2xl space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Welcome back, {user.name || user.full_name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-green-100 font-normal">
              Department of Computer Science • Reg. No: <span className="font-semibold text-gray-900 dark:text-white">{user.matric || user.registration_number}</span> • Current Level: <span className="font-semibold text-[#138601] dark:text-[#4bd043]">{user.level || user.current_level}</span>
            </p>
          </div>
        </div>

        {/* Academic Profile Details Card (Admission Year, Level, Duration & Graduation) */}
        <div className="p-5 sm:p-6 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 dark:border-[#138601]/20 pb-3.5 mb-4 gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#138601] dark:text-[#4bd043]">
                Academic Profile & Verification
              </span>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                {user.name || user.full_name}
              </h2>
              <p className="text-xs text-gray-500 dark:text-green-100/70">
                Reg. No: <span className="font-semibold text-gray-800 dark:text-white">{user.matric || user.registration_number}</span>
              </p>
            </div>
            <div className="sm:text-right">
              <span className="inline-block px-3 py-1 bg-[#138601]/10 text-[#138601] dark:text-[#4bd043] font-bold text-xs rounded border border-[#138601]/20">
                {user.level || user.current_level || '300 Level'}
              </span>
              <p className="text-[11px] text-gray-500 dark:text-green-200/60 mt-1">Session: {user.academic_session || '2026/2027'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-gray-400 dark:text-green-200/60 block">Programme</span>
              <span className="font-semibold text-gray-800 dark:text-white">{user.programme || 'B.Tech Computer Science'}</span>
            </div>
            <div>
              <span className="text-gray-400 dark:text-green-200/60 block">Department</span>
              <span className="font-semibold text-gray-800 dark:text-white">{user.dept || user.department || 'Computer Science'}</span>
            </div>
            <div>
              <span className="text-gray-400 dark:text-green-200/60 block">Faculty</span>
              <span className="font-semibold text-gray-800 dark:text-white">{user.faculty || 'SICT, FUTO'}</span>
            </div>
            <div>
              <span className="text-gray-400 dark:text-green-200/60 block">Admission Year</span>
              <span className="font-bold text-[#138601] dark:text-[#4bd043]">{user.admission_year || (user.matric ? user.matric.substring(0, 4) : '2024')}</span>
            </div>
            <div>
              <span className="text-gray-400 dark:text-green-200/60 block">Current Level</span>
              <span className="font-bold text-[#138601] dark:text-[#4bd043]">{user.level || user.current_level || '300 Level'}</span>
            </div>
            <div>
              <span className="text-gray-400 dark:text-green-200/60 block">Programme Duration</span>
              <span className="font-semibold text-gray-800 dark:text-white">{user.programme_duration || 5} Years</span>
            </div>
            <div>
              <span className="text-gray-400 dark:text-green-200/60 block">Expected Graduation</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {user.expected_graduation_year || (parseInt(user.admission_year || (user.matric ? user.matric.substring(0, 4) : 2024), 10) + (user.programme_duration || 5))}
              </span>
            </div>
            <div>
              <span className="text-gray-400 dark:text-green-200/60 block">Status</span>
              <span className="font-semibold text-[#138601] dark:text-[#4bd043]">Active Student</span>
            </div>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* CGPA Card */}
          <div className="p-5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 dark:text-green-200/80">Cumulative CGPA</span>
              <div className="w-7 h-7 rounded bg-[#ebf3ff] dark:bg-[#138601]/20 flex items-center justify-center text-[#138601] dark:text-[#4bd043]">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{user.cgpa || '4.62'}</span>
              <span className="text-xs text-gray-400 dark:text-green-300 font-medium">/ 5.00</span>
            </div>
            <div className="text-xs text-[#138601] dark:text-[#4bd043] font-medium">
              First Class Standing
            </div>
          </div>

          {/* Dues Status Card */}
          <div className="p-5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 dark:text-green-200/80">Departmental Dues</span>
              <div className="w-7 h-7 rounded bg-[#ebf3ff] dark:bg-[#138601]/20 flex items-center justify-center text-[#138601] dark:text-[#4bd043]">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">₦2,500</span>
              <span className="text-xs text-[#138601] dark:text-[#4bd043] font-semibold bg-[#ebf3ff] dark:bg-[#138601]/20 px-2 py-0.5 rounded">Cleared</span>
            </div>
            <div className="flex items-center text-xs text-gray-600 dark:text-green-200/80 font-normal">
              <CheckCircle className="w-3.5 h-3.5 text-[#138601] dark:text-[#4bd043] mr-1" />
              <span>Digital receipt issued</span>
            </div>
          </div>

          {/* Course Registration Card */}
          <div className="p-5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 dark:text-green-200/80">Course Registration</span>
              <div className="w-7 h-7 rounded bg-[#ebf3ff] dark:bg-[#138601]/20 flex items-center justify-center text-[#138601] dark:text-[#4bd043]">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">8 Courses</span>
              <span className="text-xs text-gray-500 dark:text-green-200/70 font-medium">(21 Units)</span>
            </div>
            <div className="flex items-center text-xs text-[#138601] dark:text-[#4bd043] font-medium">
              <CheckCircle className="w-3.5 h-3.5 mr-1" />
              <span>HOD Approved</span>
            </div>
          </div>

          {/* NACOS Member ID Card */}
          <div className="p-5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 dark:text-green-200/80">Student E-Card</span>
              <div className="w-7 h-7 rounded bg-[#ebf3ff] dark:bg-[#138601]/20 flex items-center justify-center text-[#138601] dark:text-[#4bd043]">
                <User className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-sm font-bold text-gray-900 dark:text-white">Verified ID</span>
              <span className="text-[10px] text-[#138601] dark:text-green-300 bg-[#ebf3ff] dark:bg-[#138601]/25 px-1.5 py-0.5 rounded">Active</span>
            </div>
            <Link to="/id-card" className="inline-flex items-center text-xs text-[#138601] dark:text-[#4bd043] hover:underline font-medium">
              <span>Generate & Download ID</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Quick Academic Actions */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Quick Student Actions</h3>
            
            <div className="space-y-2.5">
              <Link
                to="/id-card"
                className="flex items-center justify-between p-3.5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 hover:border-gray-400 dark:hover:border-[#138601] transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded bg-[#f1f3f5] dark:bg-[#041801] flex items-center justify-center text-gray-700 dark:text-[#4bd043] group-hover:bg-[#138601] group-hover:text-white transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Official Student ID Card</h4>
                    <p className="text-xs text-gray-500 dark:text-green-200/70 font-normal">Generate & print digital identity card</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
              </Link>
              <Link
                to="/results"
                className="flex items-center justify-between p-3.5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 hover:border-gray-400 dark:hover:border-[#138601] transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded bg-[#f1f3f5] dark:bg-[#041801] flex items-center justify-center text-gray-700 dark:text-[#4bd043] group-hover:bg-[#138601] group-hover:text-white transition-colors">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Check Semester Results</h4>
                    <p className="text-xs text-gray-500 dark:text-green-200/70 font-normal">View GP transcript breakdown</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
              </Link>

              <Link
                to="/dues"
                className="flex items-center justify-between p-3.5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 hover:border-gray-400 dark:hover:border-[#138601] transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded bg-[#f1f3f5] dark:bg-[#041801] flex items-center justify-center text-gray-700 dark:text-[#4bd043] group-hover:bg-[#138601] group-hover:text-white transition-colors">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Dues Clearance Receipt</h4>
                    <p className="text-xs text-gray-500 dark:text-green-200/70 font-normal">Generate verified electronic receipt</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
              </Link>

              <Link
                to="/courses"
                className="flex items-center justify-between p-3.5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 hover:border-gray-400 dark:hover:border-[#138601] transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded bg-[#f1f3f5] dark:bg-[#041801] flex items-center justify-center text-gray-700 dark:text-[#4bd043] group-hover:bg-[#138601] group-hover:text-white transition-colors">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Course Notes & Past Questions</h4>
                    <p className="text-xs text-gray-500 dark:text-green-200/70 font-normal">2018–2025 verified test packs</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
              </Link>
            </div>
          </div>

          {/* Recent Semester Grades */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Recent Semester Grades</h3>
              <Link to="/results" className="text-xs font-semibold text-[#138601] dark:text-[#4bd043] hover:underline">
                View All
              </Link>
            </div>

            <div className="p-4 sm:p-5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 space-y-3">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-[#138601]/30 text-gray-500 dark:text-green-200/70 font-medium">
                      <th className="pb-2">Course Code</th>
                      <th className="pb-2">Course Title</th>
                      <th className="pb-2 text-center">Units</th>
                      <th className="pb-2 text-center">Score</th>
                      <th className="pb-2 text-right">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-[#138601]/15 font-normal">
                    <tr>
                      <td className="py-2.5 font-semibold text-gray-900 dark:text-white">CSC 301</td>
                      <td className="py-2.5 text-gray-600 dark:text-green-100">Structured Programming</td>
                      <td className="py-2.5 text-center text-gray-600 dark:text-green-100">3</td>
                      <td className="py-2.5 text-center font-semibold text-gray-900 dark:text-white">84%</td>
                      <td className="py-2.5 text-right font-bold text-[#138601] dark:text-[#4bd043]">A</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-gray-900 dark:text-white">CSC 303</td>
                      <td className="py-2.5 text-gray-600 dark:text-green-100">Data Structures & Algorithms</td>
                      <td className="py-2.5 text-center text-gray-600 dark:text-green-100">3</td>
                      <td className="py-2.5 text-center font-semibold text-gray-900 dark:text-white">79%</td>
                      <td className="py-2.5 text-right font-bold text-[#138601] dark:text-[#4bd043]">A</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-gray-900 dark:text-white">CSC 305</td>
                      <td className="py-2.5 text-gray-600 dark:text-green-100">Operating Systems I</td>
                      <td className="py-2.5 text-center text-gray-600 dark:text-green-100">3</td>
                      <td className="py-2.5 text-center font-semibold text-gray-900 dark:text-white">72%</td>
                      <td className="py-2.5 text-right font-bold text-[#138601] dark:text-[#4bd043]">A</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-gray-900 dark:text-white">CSC 309</td>
                      <td className="py-2.5 text-gray-600 dark:text-green-100">Database Design & SQL</td>
                      <td className="py-2.5 text-center text-gray-600 dark:text-green-100">2</td>
                      <td className="py-2.5 text-center font-semibold text-gray-900 dark:text-white">88%</td>
                      <td className="py-2.5 text-right font-bold text-[#138601] dark:text-[#4bd043]">A</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-[#138601]/20 flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-green-200/80 font-normal">300 Level • First Semester GPA</span>
                <span className="font-bold text-gray-900 dark:text-white bg-[#f1f3f5] dark:bg-[#041801] px-2.5 py-1 rounded">4.82 / 5.00</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </PortalLayout>
  );
};

export default Dashboard;
