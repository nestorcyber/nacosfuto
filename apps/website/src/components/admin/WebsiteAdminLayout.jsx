import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Camera, 
  Newspaper, 
  Calendar, 
  Home, 
  Settings, 
  Users, 
  History, 
  LogOut, 
  Menu, 
  X, 
  Globe, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { BsSun, BsMoon } from 'react-icons/bs';
import { useTheme } from '../../context/ThemeContext';
import { getWebsiteAdminSession, logoutWebsiteAdmin, hasPermission } from '@nacos/supabase/adminAuth';
import logoDark from '../../assets/full-logo-dark.png';
import logoLight from '../../assets/full-logo-light.png';

export const WebsiteAdminLayout = ({ children, title, subtitle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const session = getWebsiteAdminSession();
    if (session) {
      setAdmin(session);
    }
  }, []);

  const handleSignOut = async () => {
    await logoutWebsiteAdmin();
    navigate('/admin/login');
  };

  const isDark = theme === 'dark';

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Media Library', path: '/admin/media', icon: ImageIcon, permission: 'main_website.media' },
    { label: 'Campus Gallery', path: '/admin/gallery', icon: Camera, permission: 'main_website.gallery' },
    { label: 'News & Journal', path: '/admin/news', icon: Newspaper, permission: 'main_website.news' },
    { label: 'Events & Flyers', path: '/admin/events', icon: Calendar, permission: 'main_website.events' },
    { label: 'Homepage Content', path: '/admin/homepage', icon: Home, permission: 'main_website.homepage' },
    { label: 'Audit Trail', path: '/admin/audit-logs', icon: History, permission: 'main_website.view' },
    ...(admin?.is_super_admin
      ? [{ label: 'Admin Management', path: '/admin/admins', icon: Users }]
      : []),
    { label: 'Website Settings', path: '/admin/settings', icon: Settings, permission: 'main_website.settings' }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#041801] text-gray-900 dark:text-white flex flex-col font-sans selection:bg-[#138601] selection:text-white">
      
      {/* Top CMS Header */}
      <header className={`sticky top-0 z-40 w-full border-b ${
        isDark 
          ? 'bg-[#083002] border-[#138601]/25 text-white' 
          : 'bg-white border-gray-200 text-gray-900 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand & Mobile Trigger */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-lg cursor-pointer ${
                isDark ? 'text-gray-200 bg-[#041801] border border-[#138601]/30' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/admin" className="flex items-center space-x-3">
              <img src={isDark ? logoDark : logoLight} alt="NACOS FUTO Logo" className="h-8 md:h-9 w-auto object-contain" />
              <div className="hidden sm:block border-l border-gray-200 dark:border-[#138601]/30 pl-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#138601] dark:text-[#4bd043] uppercase tracking-wide">
                    Website CMS
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#138601]/20 text-[#138601] dark:text-[#4bd043] border border-[#138601]/30">
                    {admin?.scope === 'super_admin' ? 'Super Admin' : 'main_website'}
                  </span>
                </div>
                <span className="text-[11px] text-gray-500 dark:text-green-200/70 block leading-tight">
                  Public Website Administration
                </span>
              </div>
            </Link>
          </div>

          {/* Right Controls & Current Admin Badge */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* View Live Website Button */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                isDark 
                  ? 'text-green-100 hover:text-white bg-[#041801] border-[#138601]/30' 
                  : 'text-gray-700 hover:text-black bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-[#138601] dark:text-[#4bd043]" />
              <span>Live Site</span>
            </a>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg text-sm transition-colors cursor-pointer ${
                isDark
                  ? 'text-yellow-300 bg-[#0d4603] hover:bg-[#138601]/40'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <BsSun className="w-4 h-4" /> : <BsMoon className="w-4 h-4" />}
            </button>

            {/* Current Admin Pill */}
            {admin && (
              <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-[#138601]/30 text-xs">
                <div className="w-8 h-8 rounded-full bg-[#138601] text-white font-bold flex items-center justify-center text-xs">
                  {admin.full_name?.slice(0, 2).toUpperCase() || 'AD'}
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 dark:text-white truncate max-w-[120px] leading-none">
                    {admin.full_name}
                  </div>
                  <span className="text-[10px] text-[#138601] dark:text-[#4bd043] font-medium leading-none block mt-0.5 capitalize">
                    {admin.role.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:text-white bg-red-50 dark:bg-red-950/40 hover:bg-red-600 dark:hover:bg-red-900/70 border border-red-200 dark:border-red-900/50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main CMS Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:flex flex-col w-60 shrink-0 py-2 justify-between">
          <div className="space-y-6">
            
            {/* Navigation Links */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact 
                  ? location.pathname === item.path 
                  : location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#138601] text-white shadow-md'
                        : isDark
                        ? 'text-green-100/70 hover:text-white hover:bg-[#083002]'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Scoped Security Assurance Badge */}
            <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${
              isDark 
                ? 'bg-[#083002]/60 border-[#138601]/25 text-green-200/80' 
                : 'bg-green-50/60 border-green-200 text-green-800'
            }`}>
              <div className="flex items-center gap-1.5 font-bold text-xs text-green-800 dark:text-green-300">
                <ShieldCheck className="w-4 h-4 text-[#138601] dark:text-[#4bd043]" />
                <span>Isolated Admin Scope</span>
              </div>
              <p className="text-[10.5px] leading-relaxed opacity-80">
                Authorized exclusively for NACOS public web surfaces and media CDN.
              </p>
            </div>

          </div>

          <div className="text-[10px] text-gray-400 dark:text-green-200/40 pt-4 border-t border-gray-200 dark:border-[#138601]/20">
            NACOS FUTO CMS v2.0
          </div>
        </aside>

        {/* MOBILE DRAWER */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex">
            <div className="w-72 bg-white dark:bg-[#083002] border-r border-gray-200 dark:border-[#138601]/30 p-5 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-[#138601]/20">
                  <span className="font-bold text-sm">Website Navigation</span>
                  <button onClick={() => setMobileOpen(false)} className="p-1 rounded">✕</button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact 
                      ? location.pathname === item.path 
                      : location.pathname.startsWith(item.path);

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                          isActive
                            ? 'bg-[#138601] text-white'
                            : 'text-gray-700 dark:text-green-100 hover:bg-gray-100 dark:hover:bg-[#041801]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/40 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
            <div className="flex-1" onClick={() => setMobileOpen(false)} />
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0">
          {(title || subtitle) && (
            <div className="mb-6 p-6 rounded-2xl bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30">
              {title && (
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-xs text-gray-500 dark:text-green-200/80 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {children}
        </main>

      </div>
    </div>
  );
};

export default WebsiteAdminLayout;
