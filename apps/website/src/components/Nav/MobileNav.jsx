import React, { useState } from "react";
import { FiChevronDown, FiChevronRight, FiX } from "react-icons/fi";
import { BsSun, BsMoon } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import ScrollToTopLink from "../ScrollToTopLink";
import logoLight from "../../assets/full-logo-light.png";
import logoDark from "../../assets/full-logo-dark.png";
import { getAppUrls } from "@nacos/config/urls";

const MobileNav = ({ isOpen, closeMenu, toggleDarkMode, darkMode, isNacosExec }) => {
  const location = useLocation();
  const theme = darkMode ? "dark" : "light";
  const [openCategory, setOpenCategory] = useState(null);
  const { upskillHub } = getAppUrls();

  if (!isOpen) return null;

  const handleCategoryClick = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const handleThemeToggle = () => {
    toggleDarkMode();
  };

  const resources = {
    UPSKILL: [
      { name: "AI Fluency", link: `${upskillHub}/courses/course-ai-fluency`, isExternal: true },
      { name: "Web Development", link: `${upskillHub}/courses/course-web-dev`, isExternal: true },
      { name: "Resources", link: "/resources" },
      { name: "View all courses", link: `${upskillHub}/courses`, isExternal: true },
    ],
    ABOUT: [
      { name: "About Us", link: "/about" },
      { name: "Administration", link: "/about/administration" },
      { name: "NACOS Executives", link: "/about/nacos-executives" },
      { name: "News & Journal", link: "/news" },
      { name: "Alumni", link: "/about/alumni" },
      { name: "Anthems", link: "/about/anthems" },
      { name: "Gallery", link: "/about/gallery" },
    ],
    ACADEMICS: [
      { name: "Academic Year Calendar", link: "/about/calendar" },
      { name: "Learning Resources", link: "/resources" },
      { name: "Programs", link: "/programs" },
      { name: "Admission Portal", link: "/admission-portal" },
      { name: "How To Apply", link: "/how-to-apply" },
      { name: "Admission Requirements", link: "/admission-requirements" },
      { name: "Tuition & Fees", link: "/tuition-fees" },
      { name: "Futo Website", link: "https://futo.edu.ng" },
    ],
    "CAMPUS LIFE": [
      { name: "Campus Tour", link: "/campus-tour" },
      { name: "Campus Clubs", link: "/campus-clubs" },
      { name: "Events", link: "/events" },
      { name: "Yellow Pages", link: "/yellow-pages" },
      { name: "Spiritual Life", link: "/spiritual-life" },
    ],
    RESEARCH: [
      { name: "Research Overview", link: "/research" },
      { name: "Student Research", link: "/student-research" },
      { name: "Collaboration", link: "/collaboration" },
      { name: "Research Facilities", link: "/research-facilities" },
      { name: "Research Grants", link: "/research-grants" },
    ],
    "HEALTH & SAFETY": [
      { name: "Guidance & Counselling", link: "/guidance-counselling" },
      { name: "Safety Alerts", link: "/safety-alerts" },
      { name: "Report an Issue", link: "/report-emergency" },
      { name: "Health Services", link: "/health-services" },
    ],
    "CAREERS & RECRUITMENT": [
      { name: "Careers & Recruitment", link: "/careers-recruitment" },
    ]
  };

  return (
    <div
      className={`md:hidden fixed inset-0 z-50 flex flex-col ${
        darkMode ? "bg-[#041801] text-white" : "bg-white text-[#083002]"
      } transition-colors duration-200`}
    >
      {/* Dynamic top bar - pixel-perfect match to Navbar header */}
      <div
        className={`h-16 flex items-center justify-between site-container w-full flex-shrink-0 border-b ${
          isNacosExec
            ? "bg-transparent border-white/10 backdrop-blur-md"
            : darkMode
            ? "bg-[#083002] border-[#138601]/25 text-white"
            : "bg-white border-[#138601]/15 text-[#083002]"
        }`}
      >
        <div className="flex items-center flex-shrink-0">
          <ScrollToTopLink to="/" onClick={closeMenu} className="flex items-center">
            <img
              src={isNacosExec || darkMode ? logoDark : logoLight}
              alt="NACOS FUTO Logo"
              className="h-7 md:h-9 w-auto object-contain transition-all duration-300"
            />
          </ScrollToTopLink>
        </div>

        <button
          onClick={closeMenu}
          className={`p-2 rounded cursor-pointer transition-colors ${
            isNacosExec
              ? "text-white hover:bg-white/10"
              : darkMode
              ? "text-white hover:bg-white/10"
              : "text-[#083002] hover:bg-[#f2fbf1]"
          }`}
          aria-label="Close mobile menu"
        >
          <FiX size={24} />
        </button>
      </div>

      {/* Menu content */}
      <div className="flex-1 flex flex-col px-4 sm:px-6 py-5 overflow-y-auto">
        {/* Category dropdowns - Home button removed as requested */}
        <div className="flex flex-col space-y-2">
          {Object.entries(resources).map(([category, items]) => (
            <div key={category} className="mb-2">
              <button
                className={`w-full flex items-center justify-between px-4 py-3 rounded cursor-pointer ${
                  darkMode
                    ? "bg-[#083002] text-[#4bd043] border border-[#138601]/30 shadow-black/40"
                    : "bg-[#f2fbf1] text-[#083002] border border-[#138601]/20 shadow-sm"
                } font-semibold text-base sm:text-lg transition-all duration-200 focus:outline-none ${
                  openCategory === category
                    ? darkMode
                      ? "bg-[#0d4603]"
                      : "bg-[#e2f7df]"
                    : ""
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                <span>{category}</span>
                {openCategory === category ? (
                  <FiChevronDown
                    className={darkMode ? "ml-2 text-[#4bd043]" : "ml-2 text-[#083002]"}
                  />
                ) : (
                  <FiChevronRight
                    className={darkMode ? "ml-2 text-[#4bd043]" : "ml-2 text-[#083002]"}
                  />
                )}
              </button>
              {openCategory === category && (
                <ul
                  className={`mt-2 mb-2 rounded shadow-inner ${
                    darkMode
                      ? "bg-[#083002]/90 border border-[#138601]/30"
                      : "bg-white border border-[#138601]/15"
                  }`}
                >
                  {items.map((item) => (
                    <li key={item.link}>
                      {item.link.startsWith("http") || item.isExternal || item.link.startsWith("/upskill-hub") ? (
                        <a
                          href={item.link}
                          target={item.target || (item.link.startsWith("http") ? "_blank" : "_self")}
                          rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
                          className={`block py-2.5 px-5 rounded transition-colors text-sm sm:text-base font-medium ${
                            darkMode
                              ? "text-green-100 hover:bg-[#138601]/25 hover:text-[#4bd043]"
                              : "text-[#083002] hover:bg-[#f2fbf1] hover:text-[#138601]"
                          }`}
                          onClick={closeMenu}
                        >
                          {item.name}
                        </a>
                      ) : (
                        <ScrollToTopLink
                          to={item.link}
                          className={`block py-2.5 px-5 rounded transition-colors text-sm sm:text-base font-medium ${
                            location.pathname === item.link
                              ? "bg-[#138601] text-white"
                              : darkMode
                              ? "text-green-100 hover:bg-[#138601]/25 hover:text-[#4bd043]"
                              : "text-[#083002] hover:bg-[#f2fbf1] hover:text-[#138601]"
                          }`}
                          onClick={closeMenu}
                        >
                          {item.name}
                        </ScrollToTopLink>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-6 border-t border-[#138601]/20">
          <div className="grid grid-cols-1 w-full gap-3">
            <a
              href={import.meta.env.VITE_PORTAL_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? "http://localhost:5174/login" : "/portal")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="w-full text-center py-3 px-4 bg-[#138601] hover:bg-[#0f6c01] text-white font-bold rounded shadow-lg shadow-[#138601]/30 transition-colors"
            >
              Visit Portal
            </a>
            <button
              onClick={handleThemeToggle}
              className={`w-full flex items-center justify-center py-3 px-4 transition-colors font-semibold rounded ${
                darkMode 
                  ? "bg-[#083002] text-yellow-300 border border-[#138601]/30 hover:bg-[#0d4603]" 
                  : "bg-[#f2fbf1] text-[#083002] border border-[#138601]/20 hover:bg-[#e2f7df]"
              }`}
            >
              {darkMode ? (
                <>
                  <BsSun className="mr-3 text-yellow-300" />
                  Light Mode
                </>
              ) : (
                <>
                  <BsMoon className="mr-3 text-[#083002]" />
                  Dark Mode
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
