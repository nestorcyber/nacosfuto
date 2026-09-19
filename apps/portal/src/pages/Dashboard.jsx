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
  Info,
  BarChart3,
  Wallet,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import PortalLayout from '../components/PortalLayout';

const Dashboard = () => {
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

  useEffect(() => {
    const handleUserUpdate = () => {
      const stored = localStorage.getItem('nacos_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
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

  const getFirstName = () => {
    if (user.firstName && !user.firstName.toLowerCase().includes('president')) return user.firstName;
    if (user.first_name && !user.first_name.toLowerCase().includes('president')) return user.first_name;
    const fullName = (user.full_name || user.fullName || user.name || '').trim();
    if (fullName.toLowerCase().includes('president') || fullName.toLowerCase().includes('irechukwu')) {
      return 'Emmanuel';
    }
    if (fullName) {
      const parts = fullName.split(/\s+/);
      return parts[0] || 'Student';
    }
    return 'Student';
  };

  const firstName = getFirstName();

  return (
    <PortalLayout>
      <div className="space-y-5">
        
        {/* Welcome Header */}
        <div className="pb-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Welcome, {firstName}!
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-green-200/80 mt-0.5">
            Department of Computer Science • Federal University of Technology, Owerri
          </p>
        </div>

        {/* Feedback / Appraisal Banner (Matching Reference) */}
        <div className="p-4 sm:p-5 rounded bg-[#ebf3ff] dark:bg-[#083002] border border-blue-100 dark:border-[#138601]/30 flex items-start gap-3.5">
          <div className="w-5 h-5 rounded-full bg-blue-600 dark:bg-[#138601] flex items-center justify-center text-white shrink-0 mt-0.5">
            <Info className="w-3.5 h-3.5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
              We would love to hear from you!
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-green-100 font-normal">
              Please take a moment to complete this short appraisal to help us enhance our learning environment.
            </p>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdboB_xQGvHB9GJfFyj2JOHzQAYwRp3-RCFv5nJ7yP2_YPCcQ/viewform?usp=header"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 dark:text-[#4bd043] hover:underline pt-0.5 cursor-pointer"
            >
              <span>Start Your Appraisal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 3 Clean, Unclustered Summary Cards (Matching Reference Image) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Courses Registered */}
          <div className="p-4 sm:p-5 rounded bg-[#ebf3ff] dark:bg-[#083002] border border-blue-100/70 dark:border-[#138601]/30 flex flex-col justify-between min-h-[125px] shadow-xs">
            <div className="text-blue-600 dark:text-[#4bd043]">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="mt-3 space-y-1.5">
              <h4 className="text-xs sm:text-sm font-normal text-gray-700 dark:text-gray-200">
                Courses Registered
              </h4>
              <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                40 courses
              </div>
            </div>
          </div>

          {/* Card 2: Results Published */}
          <div className="p-4 sm:p-5 rounded bg-[#e6fafc] dark:bg-[#083002] border border-cyan-100/70 dark:border-[#138601]/30 flex flex-col justify-between min-h-[125px] shadow-xs">
            <div className="text-cyan-600 dark:text-[#4bd043]">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="mt-3 space-y-1.5">
              <h4 className="text-xs sm:text-sm font-normal text-gray-700 dark:text-gray-200">
                Results Published
              </h4>
              <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                0 results
              </div>
            </div>
          </div>

          {/* Card 3: Fees Paid */}
          <div className="p-4 sm:p-5 rounded bg-[#bbf0b7] dark:bg-[#138601]/30 border border-green-200/70 dark:border-[#138601]/40 flex flex-col justify-between min-h-[125px] shadow-xs">
            <div className="text-[#083002] dark:text-[#4bd043]">
              <Wallet className="w-6 h-6" />
            </div>
            <div className="mt-3 space-y-1.5">
              <h4 className="text-xs sm:text-sm font-normal text-gray-800 dark:text-white">
                Fees paid
              </h4>
              <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                353,000 NGN
              </div>
            </div>
          </div>

        </div>

        {/* Quick Student Actions */}
        <div className="space-y-3">
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">Quick Student Actions</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <Link
              to="/dues"
              className="flex items-center justify-between p-3.5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 hover:border-gray-400 dark:hover:border-[#138601] transition-all group shadow-xs"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded bg-[#f1f3f5] dark:bg-[#041801] flex items-center justify-center text-gray-700 dark:text-[#4bd043] group-hover:bg-[#138601] group-hover:text-white transition-colors shrink-0">
                  <CreditCard className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Dues Clearance Receipt</h4>
                  <p className="text-[11px] sm:text-xs text-gray-500 dark:text-green-200/80 font-normal mt-0.5">Generate verified electronic receipt</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors shrink-0" />
            </Link>

            <Link
              to="/id-card"
              className="flex items-center justify-between p-3.5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 hover:border-gray-400 dark:hover:border-[#138601] transition-all group shadow-xs"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded bg-[#f1f3f5] dark:bg-[#041801] flex items-center justify-center text-gray-700 dark:text-[#4bd043] group-hover:bg-[#138601] group-hover:text-white transition-colors shrink-0">
                  <User className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Official Student ID Card</h4>
                  <p className="text-[11px] sm:text-xs text-gray-500 dark:text-green-200/80 font-normal mt-0.5">Generate & print digital identity card</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors shrink-0" />
            </Link>

            <Link
              to="/results"
              className="flex items-center justify-between p-3.5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 hover:border-gray-400 dark:hover:border-[#138601] transition-all group shadow-xs"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded bg-[#f1f3f5] dark:bg-[#041801] flex items-center justify-center text-gray-700 dark:text-[#4bd043] group-hover:bg-[#138601] group-hover:text-white transition-colors shrink-0">
                  <GraduationCap className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Check Semester Results</h4>
                  <p className="text-[11px] sm:text-xs text-gray-500 dark:text-green-200/80 font-normal mt-0.5">View GP transcript breakdown</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors shrink-0" />
            </Link>

            <Link
              to="/courses"
              className="flex items-center justify-between p-3.5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 hover:border-gray-400 dark:hover:border-[#138601] transition-all group shadow-xs"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded bg-[#f1f3f5] dark:bg-[#041801] flex items-center justify-center text-gray-700 dark:text-[#4bd043] group-hover:bg-[#138601] group-hover:text-white transition-colors shrink-0">
                  <BookOpen className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Course Notes & Past Questions</h4>
                  <p className="text-[11px] sm:text-xs text-gray-500 dark:text-green-200/80 font-normal mt-0.5">2018–2025 verified test packs</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors shrink-0" />
            </Link>

            <Link
              to="/profile"
              className="flex items-center justify-between p-3.5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 hover:border-gray-400 dark:hover:border-[#138601] transition-all group shadow-xs"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded bg-[#f1f3f5] dark:bg-[#041801] flex items-center justify-center text-gray-700 dark:text-[#4bd043] group-hover:bg-[#138601] group-hover:text-white transition-colors shrink-0">
                  <User className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Student Profile</h4>
                  <p className="text-[11px] sm:text-xs text-gray-500 dark:text-green-200/80 font-normal mt-0.5">View and update bio & academic info</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Dashboard;
