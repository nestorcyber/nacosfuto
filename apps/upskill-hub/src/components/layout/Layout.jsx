import React, { useState } from "react";
import { Sidebar, SidebarTrigger } from "./Sidebar";
import { Link } from "react-router-dom";
import { Sparkles, GraduationCap } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";

export function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isCreator = user?.user_metadata?.role === "creator";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onToggle={setSidebarOpen} />

      {/* Main Container shifted right on desktop */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between p-3.5 sm:px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger onClick={() => setSidebarOpen(true)} />
              <Link to="/" className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight">Upskill Hub</span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-[#138601]/10 text-[#138601] border border-[#138601]/30">
                  NACOS FUTO
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {isCreator ? (
                <Link
                  to="/create-course"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#138601] text-white hover:bg-[#0f6c01] transition-all shadow-xs cursor-pointer"
                >
                  <Sparkles size={13} />
                  <span>Create Course</span>
                </Link>
              ) : (
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-foreground text-primary-foreground hover:bg-foreground/90 transition-all shadow-xs cursor-pointer"
                >
                  <GraduationCap size={13} />
                  <span>Browse Tracks</span>
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
