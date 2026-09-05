import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  CreditCard, 
  BookOpen, 
  User, 
  Users,
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  ShieldCheck,
  Globe,
  Image as ImageIcon
} from 'lucide-react';
import { BsSun, BsMoon } from 'react-icons/bs';
import { useTheme } from '../context/ThemeContext';
import logoDark from '../assets/full-logo-dark.png';
import logoLight from '../assets/full-logo-light.png';

const PortalLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState({
    name: 'David Okonkwo',
    matric: '2022/139481',
    level: '300 Level',
    dept: 'Computer Science',
    chapter: 'FUTO Chapter'
  });

  useEffect(() => {
    const stored = localStorage.getItem('nacos_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nacos_user');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Student ID Card', path: '/id-card', icon: ShieldCheck },
    { label: 'Academic Results', path: '/results', icon: GraduationCap },
    { label: 'Dues & Clearance', path: '/dues', icon: CreditCard },
    { label: 'Course Materials', path: '/courses', icon: BookOpen },
    { label: 'Student Profile & Bio', path: '/profile', icon: User },
    ...(user.role === 'Chapter President' || user.role === 'Admin'
      ? [
          { label: 'Student Registry', path: '/admin/students', icon: Users },
          { label: 'ID Applications', path: '/admin/id-cards', icon: ShieldCheck },
          { label: 'Media Management', path: '/admin/media', icon: ImageIcon }
        ]
      : [])
  ];

  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#041801] text-gray-900 dark:text-white flex flex-col font-sans selection:bg-[#138601] selection:text-white">
      
      {/* Top Header */}
      <header className={`sticky top-0 z-40 w-full border-b ${
        isDark 
          ? 'bg-[#083002] border-[#138601]/25 text-white' 
          : 'bg-white border-gray-200 text-gray-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded cursor-pointer ${
                isDark ? 'text-gray-200 hover:text-white bg-[#041801] border border-[#138601]/30' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/dashboard" className="flex items-center space-x-3">
              <img src={isDark ? logoDark : logoLight} alt="NACOS FUTO Logo" className="h-8 md:h-9 w-auto object-contain" />
              <div className="hidden sm:block border-l border-gray-200 dark:border-[#138601]/30 pl-3">
                <span className="text-[11px] font-semibold text-[#138601] dark:text-[#4bd043] block leading-none">
                  Student Portal
                </span>
                <span className="text-[12px] font-normal text-gray-500 dark:text-green-200/80 block mt-0.5 leading-tight">
                  Department of Computer Science
                </span>
              </div>
            </Link>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded text-sm transition-colors cursor-pointer ${
                isDark
                  ? 'text-yellow-300 bg-[#0d4603] hover:bg-[#138601]/40'
                  : 'text-gray-700 bg-[#f1f3f5] hover:bg-[#e9ecef]'
              }`}
              aria-label="Toggle dark mode"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <BsSun className="w-4 h-4" /> : <BsMoon className="w-4 h-4" />}
            </button>

            {/* Public site link */}
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                isDark ? 'text-green-100 hover:text-white bg-[#041801] border-[#138601]/30' : 'text-gray-700 hover:text-black bg-[#f1f3f5] border-gray-200 hover:bg-[#e9ecef]'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-[#138601] dark:text-[#4bd043]" /> Main Website
            </a>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded text-xs font-semibold text-red-600 dark:text-red-400 hover:text-white bg-red-50 dark:bg-red-950/40 hover:bg-red-600 dark:hover:bg-red-900/70 border border-red-200 dark:border-red-900/50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-8">
        
        {/* DESKTOP SIDEBAR: Generous Spacing like reference */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 py-2 justify-between">
          
          <div className="space-y-6">
            {/* Student Profile Overview Card */}
            <div className={`p-4 rounded border space-y-3 ${
              isDark ? 'bg-[#083002] border-[#138601]/30' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded bg-[#138601] flex items-center justify-center text-white font-bold text-sm">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : 'DO'}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name || 'David Okonkwo'}</h4>
                  <p className="text-xs text-gray-500 dark:text-[#4bd043] font-medium truncate">{user.matric || '2022/139481'}</p>
                </div>
              </div>
              <div className={`pt-2 border-t flex items-center justify-between text-xs ${
                isDark ? 'border-[#138601]/20 text-green-200' : 'border-gray-100 text-gray-600'
              }`}>
                <span className="flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#138601] dark:text-[#4bd043]" /> {user.level || '300 Level'}
                </span>
                <span className="text-[11px] font-semibold text-[#138601] dark:text-[#4bd043] bg-[#ebf3ff] dark:bg-[#138601]/15 px-2 py-0.5 rounded">
                  Verified
                </span>
              </div>
            </div>

            {/* Navigation Links with Generous Spacing */}
            <nav className="space-y-3">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3.5 py-3 rounded text-xs font-semibold transition-all ${
                      active
                        ? 'bg-[#138601] text-white'
                        : isDark
                        ? 'text-green-100 hover:text-white hover:bg-[#083002] border border-transparent'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-[#f1f3f5] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : isDark ? 'text-[#4bd043]' : 'text-gray-600'}`} />
                      <span>{item.label}</span>
                    </div>
                    {active && <ChevronRight className="w-3.5 h-3.5 text-white" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Semester Progress Bar (Inspired by Reference Image) */}
          <div className={`p-4 rounded border mt-auto space-y-2 ${
            isDark ? 'bg-[#083002] border-[#138601]/30' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-green-200">
              <span>Semester 1 of 2</span>
              <span className="text-[#138601] dark:text-[#4bd043]">2025/2026</span>
            </div>
            {/* Clean Progress Track */}
            <div className="w-full h-1.5 bg-gray-200 dark:bg-[#041801] rounded overflow-hidden">
              <div className="h-full bg-[#138601] w-3/5 rounded"></div>
            </div>
            <div className="text-[11px] text-gray-500 dark:text-green-200/70 font-normal">
              First Semester Examinations
            </div>
          </div>

        </aside>

        {/* MOBILE NAVIGATION DRAWER */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-[#041801]/95 flex flex-col p-6 text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <img src={logoDark} alt="NACOS Logo" className="h-7 w-auto object-contain" />
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded text-gray-400 hover:text-white bg-[#083002]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-3 flex-1">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded text-sm font-semibold ${
                      active ? 'bg-[#138601] text-white' : 'text-green-100 bg-[#083002]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={handleLogout}
              className="w-full py-3 text-center text-sm font-semibold text-red-400 bg-red-950/40 rounded border border-red-900/50 mt-4 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* MAIN BODY VIEW */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>

    </div>
  );
};

export default PortalLayout;
