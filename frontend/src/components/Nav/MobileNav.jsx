import React, { useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { AiOutlineHome } from "react-icons/ai";
import { BsSun, BsMoon } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import NavLink from "./NavLink";
import ScrollToTopLink from "../ScrollToTopLink";

const MobileNav = ({ isOpen, closeMenu, toggleDarkMode, darkMode }) => {
  const location = useLocation();
  const theme = darkMode ? "dark" : "light";
  const [openCategory, setOpenCategory] = useState(null);

  if (!isOpen) return null;

  const handleCategoryClick = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const handleThemeToggle = () => {
    toggleDarkMode();
  };

  const resources = {
    UPSKILL: [
      { name: "Web Development", link: "/upskill/web-development" },
      { name: "AI & Automation", link: "/upskill/ai-automation" },
      { name: "Vibe Coding", link: "/upskill/vibe-coding" },
      { name: "Social Media", link: "/upskill/social-media" },
      { name: "View all courses", link: "/upskill/all" },
    ],
    ABOUT: [
      { name: "About Us", link: "/about" },
      { name: "NACOS Executives", link: "/about/nacos-executives" },
      { name: "Administration", link: "/about/administration" },
      { name: "Faculty", link: "/faculty" },
      { name: "Alumni", link: "/about/alumni" },
      { name: "Anthems", link: "/about/anthems" },
      { name: "Gallery", link: "/about/gallery" },
    ],
    ACADEMICS: [
      { name: "Academic Year Calendar", link: "/about/calendar" },
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
    RESOURCES: [
      { name: "Learning Resources", link: "/resources" },
      { name: "Announcements", link: "/announcements" },
      { name: "Student Handbook", link: "/student-handbook" },
      { name: "FAQs", link: "/faqs" },
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
      className={`md:hidden fixed inset-0 z-40 ${
        theme === "light" ? "bg-white" : "bg-gray-900"
      } bg-opacity-95 backdrop-blur-sm`}
      style={theme === "light" ? { boxShadow: "0 0 0 100vmax #fff inset" } : {}}
    >
      <div className="flex flex-col h-full p-6 overflow-y-auto">
        <button
          onClick={closeMenu}
          className={`self-end text-2xl p-2 cursor-pointer ${
            theme === "light" ? "text-[#07160c]" : "text-white"
          }`}
          aria-label="Close menu"
        >
          ✕
        </button>

        <div className="flex flex-col space-y-0">
          <NavLink to="/" icon={AiOutlineHome} mobile onClick={closeMenu}>
            Home
          </NavLink>

          {/* Category dropdowns */}
          {Object.entries(resources).map(([category, items]) => (
            <div key={category} className="mb-3">
              <button
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer ${
                  theme === "light"
                    ? "bg-white text-[#07160c] border border-gray-200 shadow-sm"
                    : "bg-gray-700 dark:bg-gray-800 text-green-400"
                } font-semibold text-lg hover:bg-green-50 transition-all duration-200 focus:outline-none ${
                  openCategory === category
                    ? theme === "light"
                      ? "bg-green-50"
                      : "bg-gray-600"
                    : ""
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                <span>{category}</span>
                {openCategory === category ? (
                  <FiChevronDown
                    className={
                      theme === "light"
                        ? "ml-2 text-[#07160c]"
                        : "ml-2 text-green-400"
                    }
                  />
                ) : (
                  <FiChevronRight
                    className={
                      theme === "light"
                        ? "ml-2 text-[#07160c]"
                        : "ml-2 text-green-400"
                    }
                  />
                )}
              </button>
              {openCategory === category && (
                <ul
                  className={`mt-2 mb-2 rounded-xl shadow-inner ${
                    theme === "light"
                      ? "bg-white border border-gray-100"
                      : "bg-gray-800"
                  }`}
                >
                  {items.map((item) => (
                    <li key={item.link}>
                      {item.link.startsWith("http") ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`block py-2 px-5 rounded transition-colors text-base font-medium ${
                            theme === "light"
                              ? "text-[#07160c] hover:bg-green-50"
                              : "text-white hover:bg-gray-700"
                          }`}
                          onClick={closeMenu}
                        >
                          {item.name}
                        </a>
                      ) : (
                        <ScrollToTopLink
                          to={item.link}
                          className={`block py-2 px-5 rounded transition-colors text-base font-medium ${
                            location.pathname === item.link
                              ? theme === "light"
                                ? "bg-green-700 text-white"
                                : "bg-green-600 text-white"
                              : theme === "light"
                              ? "text-[#07160c] hover:bg-green-50"
                              : "text-white hover:bg-gray-700"
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

        <div className="mt-auto pt-6 border-t border-gray-700">
          <div className="grid grid-cols-1 w-full gap-3">
            <a
              href={import.meta.env.VITE_PORTAL_URL || "https://portal.futocsc.edu.ng"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="w-full text-center py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              Visit Portal
            </a>
            <button
              onClick={handleThemeToggle}
              className="w-full flex items-center justify-center py-3 px-4 bg-gray-700 hover:bg-gray-600 transition-colors text-white rounded-lg"
            >
              {theme === "dark" ? (
                <>
                  <BsSun className="mr-3 text-yellow-300" />
                  Light Mode
                </>
              ) : (
                <>
                  <BsMoon className="mr-3" />
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
