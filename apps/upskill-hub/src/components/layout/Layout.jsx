import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export const Layout = () => {
  const location = useLocation();
  
  // The Course Taking view (/courses/:id) uses the specialized top bar from the screenshot
  const isCourseTakingView = Boolean(
    location.pathname.match(/^\/courses\/[^/]+$/) && !location.pathname.endsWith('/courses')
  );

  if (isCourseTakingView) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-gray-900 flex flex-col font-sans">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#041801] text-white flex flex-col font-sans selection:bg-[#138601] selection:text-white">
      {/* Standard Top Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col">
        <Outlet />
      </main>

      {/* Modern Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
