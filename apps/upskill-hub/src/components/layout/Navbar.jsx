import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  BookOpen, 
  Compass, 
  GraduationCap, 
  Video, 
  Sparkles, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown, 
  Layers, 
  Award,
  Laptop
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { getAppUrls } from '@nacos/config/urls';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [exploreOpen, setExploreOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const exploreRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target)) {
        setExploreOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isCurrent = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Scholar';
  const isNacosStudent = user?.isNacosStudent || user?.user_metadata?.is_nacos_student;
  const matricNo = user?.user_metadata?.matric_number || '';
  const initials = displayName.slice(0, 2).toUpperCase();

  const categories = [
    { name: 'Web Development', tag: 'web-dev', desc: 'React, Node.js, Next.js & Fullstack' },
    { name: 'Artificial Intelligence & Data', tag: 'ai', desc: 'Machine Learning, PyTorch, Data Science' },
    { name: 'Cyber Security & Ethical Hacking', tag: 'cybersecurity', desc: 'Network Defense, Forensics & Audits' },
    { name: 'Cloud Computing & DevOps', tag: 'cloud', desc: 'Docker, Kubernetes, AWS & CI/CD' },
    { name: 'Mobile App Engineering', tag: 'mobile', desc: 'Flutter, React Native & Android' },
    { name: 'UI/UX & Product Design', tag: 'ui-ux', desc: 'Figma, Prototyping & User Research' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#083002]/95 backdrop-blur-md border-b border-[#138601]/30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo & Explore Dropdown */}
        <div className="flex items-center gap-4 lg:gap-6 shrink-0">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-[#138601] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-white group-hover:text-[#4bd043] transition-colors">
                  NACOS
                </span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-[#138601]/30 text-[#4bd043] border border-[#138601]/40 font-mono">
                  UPSKILL
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase leading-none hidden sm:block">
                Learning & Creator Hub
              </p>
            </div>
          </Link>

          {/* Explore Catalog Dropdown */}
          <div className="relative hidden md:block" ref={exploreRef}>
            <button
              onClick={() => setExploreOpen(!exploreOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#041801] hover:bg-[#138601]/20 border border-[#138601]/30 transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-[#4bd043]" />
              <span>Explore</span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${exploreOpen ? 'rotate-180' : ''}`} />
            </button>

            {exploreOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-[#083002] border border-[#138601]/40 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-[#138601]/20">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Tech Career Tracks
                  </p>
                </div>
                <div className="py-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.tag}
                      onClick={() => {
                        setExploreOpen(false);
                        navigate(`/courses?tag=${cat.tag}`);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#041801] hover:text-[#4bd043] transition-colors group cursor-pointer"
                    >
                      <p className="text-xs font-bold text-white group-hover:text-[#4bd043]">
                        {cat.name}
                      </p>
                      <p className="text-[10px] text-gray-400 line-clamp-1">
                        {cat.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Global Coursera-Style Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative mx-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What do you want to learn today?"
            className="w-full pl-9 pr-4 py-2 bg-[#041801] border border-[#138601]/30 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#138601] transition-all"
          />
        </form>

        {/* Right Navigation Links & Auth Actions */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          <Link
            to="/courses"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              isCurrent('/courses') 
                ? 'text-[#4bd043] bg-[#041801]' 
                : 'text-gray-200 hover:text-white hover:bg-[#041801]'
            }`}
          >
            Courses
          </Link>

          {/* DUPLICATED EXACT RESOURCES PAGE LINK */}
          <Link
            to="/resources"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              isCurrent('/resources') 
                ? 'text-[#4bd043] bg-[#041801]' 
                : 'text-gray-200 hover:text-white hover:bg-[#041801]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#4bd043]" />
            <span>Resources</span>
          </Link>

          <Link
            to="/workshops"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              isCurrent('/workshops') 
                ? 'text-[#4bd043] bg-[#041801]' 
                : 'text-gray-200 hover:text-white hover:bg-[#041801]'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-amber-400" />
            <span>Workshops</span>
          </Link>

          {/* My Learning Dashboard */}
          <Link
            to="/my-learning"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              isCurrent('/my-learning') 
                ? 'text-[#4bd043] bg-[#041801] border border-[#138601]/40' 
                : 'text-gray-200 hover:text-white hover:bg-[#041801]'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 text-[#4bd043]" />
            <span>My Learning</span>
          </Link>

          <Link
            to="/create-course"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 hover:text-white hover:bg-[#041801] transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Teach</span>
          </Link>

          {/* User Account / Profile Dropdown */}
          {isAuthenticated ? (
            <div className="relative ml-2" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full bg-[#041801] border border-[#138601]/40 hover:border-[#138601] transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#138601] flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <span className="text-xs font-semibold text-white max-w-[100px] truncate">
                  {displayName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#083002] border border-[#138601]/40 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2.5 border-b border-[#138601]/20">
                    <p className="text-xs font-bold text-white truncate">{displayName}</p>
                    <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                    {isNacosStudent && (
                      <span className="mt-1.5 inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-[#138601]/20 border border-[#138601]/40 text-[#4bd043]">
                        NACOS Student ({matricNo || 'Verified'})
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    <Link
                      to="/my-learning"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-200 hover:bg-[#041801] hover:text-[#4bd043]"
                    >
                      <Laptop className="w-4 h-4" />
                      <span>My Learning Dashboard</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-200 hover:bg-[#041801] hover:text-[#4bd043]"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile & Badges</span>
                    </Link>

                    <a
                      href={getAppUrls().portal}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-200 hover:bg-[#041801] hover:text-[#4bd043]"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>NACOS Student Portal</span>
                    </a>
                  </div>

                  <div className="pt-1 border-t border-[#138601]/20">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-950/40 text-left transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white hover:bg-[#041801] border border-transparent transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] shadow-sm transition-colors"
              >
                Join Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#041801] border border-[#138601]/30 text-white cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#138601]/30 bg-[#083002] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses and topics..."
              className="w-full pl-9 pr-3 py-2 bg-[#041801] border border-[#138601]/30 rounded-lg text-xs text-white placeholder-gray-400"
            />
          </form>

          <nav className="space-y-1">
            <Link
              to="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-white hover:bg-[#041801]"
            >
              Browse All Courses
            </Link>
            <Link
              to="/resources"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-[#4bd043] hover:bg-[#041801]"
            >
              <BookOpen className="w-4 h-4" />
              <span>Academic Resources</span>
            </Link>
            <Link
              to="/workshops"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-amber-300 hover:bg-[#041801]"
            >
              <Video className="w-4 h-4" />
              <span>Live Workshops</span>
            </Link>
            <Link
              to="/my-learning"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white hover:bg-[#041801]"
            >
              <Laptop className="w-4 h-4" />
              <span>My Learning Dashboard</span>
            </Link>
            <Link
              to="/create-course"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-emerald-300 hover:bg-[#041801]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Teach / Creator Studio</span>
            </Link>
          </nav>

          <div className="pt-3 border-t border-[#138601]/20">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{displayName}</p>
                  <p className="text-[11px] text-gray-400">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 bg-red-950/40 border border-red-900/40"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-lg text-xs font-semibold text-white bg-[#041801] border border-[#138601]/30"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-lg text-xs font-semibold text-white bg-[#138601]"
                >
                  Join Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
