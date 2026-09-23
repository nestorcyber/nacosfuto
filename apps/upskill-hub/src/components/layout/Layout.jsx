import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export const Layout = () => {
  const location = useLocation();
  
  // The Course Taking view (/courses/:id) uses the specialized top bar
  const isCourseTakingView = Boolean(
    location.pathname.match(/^\/courses\/[^/]+(\/learn)?$/) && !location.pathname.endsWith('/courses')
  );

  if (isCourseTakingView) {
    return (
      <div className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#f8fafc] text-gray-900 flex flex-col font-sans">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] text-gray-900 dark:text-white flex flex-col font-sans selection:bg-[#0056D2] selection:text-white transition-colors duration-300">
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
