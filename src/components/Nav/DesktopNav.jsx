import React from "react";
import NavLink from "./NavLink";
import { FiChevronDown } from "react-icons/fi";
import { BsSun, BsMoon } from "react-icons/bs";
import ScrollToTopLink from "../ScrollToTopLink";
import { useTheme } from "../../context/ThemeContext";
import SearchBar from "../SearchBar";

// Custom Dropdown Component
const NavDropdown = ({ label, items, theme }) => {
  return (
    <div className="relative group py-2">
      <button
        className={`flex items-center space-x-1 font-semibold transition-colors cursor-pointer ${
          theme === "light"
            ? "text-[#083002] hover:text-[#138601]"
            : "text-gray-200 hover:text-[#4bd043]"
        }`}
      >
        <span className="whitespace-nowrap tracking-wide">{label}</span>
        <FiChevronDown className="text-xs transition-transform duration-200 group-hover:rotate-180" />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute top-full left-0 mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 w-56 z-50 rounded-xl shadow-xl border ${
          theme === "light"
            ? "bg-white border-[#138601]/20 text-[#083002]"
            : "bg-[#083002] border-[#138601]/30 text-white shadow-black/60"
        }`}
      >
        {items.map((item, idx) => {
          if (item.link.startsWith("http")) {
            return (
              <a
                key={idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                  theme === "light"
                    ? "hover:bg-[#f2fbf1] hover:text-[#138601] text-[#083002]"
                    : "hover:bg-[#138601]/25 hover:text-[#4bd043] text-green-100"
                }`}
              >
                {item.name}
              </a>
            );
          }
          return (
            <ScrollToTopLink
              key={idx}
              to={item.link}
              className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                theme === "light"
                  ? "hover:bg-[#f2fbf1] hover:text-[#138601] text-[#083002]"
                  : "hover:bg-[#138601]/25 hover:text-[#4bd043] text-green-100"
              }`}
            >
              {item.name}
            </ScrollToTopLink>
          );
        })}
      </div>
    </div>
  );
};

// Custom Dropdown Component for "MORE" mega menu
const MoreDropdown = ({ theme }) => {
  const moreCategories = {
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
    ],
  };

  return (
    <div className="relative group py-2">
      <button
        className={`flex items-center space-x-1 font-semibold transition-colors cursor-pointer ${
          theme === "light"
            ? "text-[#083002] hover:text-[#138601]"
            : "text-gray-200 hover:text-[#4bd043]"
        }`}
      >
        <span className="whitespace-nowrap tracking-wide">MORE</span>
        <FiChevronDown className="text-xs transition-transform duration-200 group-hover:rotate-180" />
      </button>
      {/* Mega Menu Dropdown */}
      <div
        className={`absolute top-full right-0 mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-6 w-[640px] z-50 rounded-2xl shadow-2xl border grid grid-cols-2 lg:grid-cols-4 gap-6 ${
          theme === "light"
            ? "bg-white border-[#138601]/20 text-[#083002]"
            : "bg-[#083002] border-[#138601]/30 text-white shadow-black/60"
        }`}
      >
        {Object.entries(moreCategories).map(([category, items]) => (
          <div key={category} className="space-y-2 text-left">
            <h4 className="text-xs font-extrabold tracking-wider text-[#138601] dark:text-[#4bd043] uppercase">
              {category}
            </h4>
            <ul className="space-y-1">
              {items.map((item, idx) => (
                <li key={idx}>
                  <ScrollToTopLink
                    to={item.link}
                    className={`block py-1 text-sm font-medium transition-colors ${
                      theme === "light"
                        ? "hover:text-[#138601] text-[#083002]/80"
                        : "hover:text-[#4bd043] text-green-100/80"
                    }`}
                  >
                    {item.name}
                  </ScrollToTopLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const DesktopNav = () => {
  const { theme, toggleTheme } = useTheme();

  const upskillItems = [
    { name: "Web Development", link: "/upskill/web-development" },
    { name: "AI & Automation", link: "/upskill/ai-automation" },
    { name: "Vibe Coding", link: "/upskill/vibe-coding" },
    { name: "Social Media", link: "/upskill/social-media" },
    { name: "View all courses", link: "/upskill/all" },
  ];

  const aboutItems = [
    { name: "About Us", link: "/about" },
    { name: "NACOS Executives", link: "/about/nacos-executives" },
    { name: "Administration", link: "/about/administration" },
    { name: "Faculty", link: "/faculty" },
    { name: "Alumni", link: "/about/alumni" },
    { name: "Anthems", link: "/about/anthems" },
    { name: "Gallery", link: "/about/gallery" },
  ];

  const academicsItems = [
    { name: "Academic Year Calendar", link: "/about/calendar" },
    { name: "Programs", link: "/programs" },
    { name: "Admission Portal", link: "/admission-portal" },
    { name: "How To Apply", link: "/how-to-apply" },
    { name: "Admission Requirements", link: "/admission-requirements" },
    { name: "Tuition & Fees", link: "/tuition-fees" },
    { name: "Futo Website", link: "https://futo.edu.ng" },
  ];

  const campusLifeItems = [
    { name: "Campus Tour", link: "/campus-tour" },
    { name: "Campus Clubs", link: "/campus-clubs" },
    { name: "Events", link: "/events" },
    { name: "Yellow Pages", link: "/yellow-pages" },
    { name: "Spiritual Life", link: "/spiritual-life" },
  ];

  return (
    <nav
      className={`hidden md:flex w-full items-center justify-between gap-4 px-1 lg:gap-6 lg:px-2 ${
        theme === "light" ? "text-[#083002]" : "text-white"
      }`}
    >
      {/* Navigation Links Group */}
      <div className="flex items-center gap-4 lg:gap-6">
        <NavLink
          to="/"
          className={`tracking-wide font-semibold ${
            theme === "light" ? "text-[#083002] hover:text-[#138601]" : "text-gray-200 hover:text-[#4bd043]"
          }`}
        >
          HOME
        </NavLink>

        <NavDropdown label="UPSKILL" items={upskillItems} theme={theme} />
        <NavDropdown label="ABOUT" items={aboutItems} theme={theme} />
        <NavDropdown label="ACADEMICS" items={academicsItems} theme={theme} />
        <NavDropdown label="CAMPUS LIFE" items={campusLifeItems} theme={theme} />
        <MoreDropdown theme={theme} />
      </div>

      {/* Utilities & Actions Group */}
      <div className="flex items-center gap-2 lg:gap-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full text-xl transition-all cursor-pointer ${
            theme === "light"
              ? "text-[#083002] bg-[#f2fbf1] hover:bg-[#e4f7e2] hover:text-[#138601]"
              : "text-yellow-300 bg-[#0d4603] hover:bg-[#138601]/40"
          }`}
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? <BsSun className="text-yellow-300" /> : <BsMoon className="text-[#083002]" />}
        </button>

        <div className="w-[180px] lg:w-[220px]">
          <SearchBar />
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4">
          <a 
            href={import.meta.env.VITE_PORTAL_URL || "https://portal.futocsc.edu.ng"}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[#138601] text-[#138601] dark:text-[#4bd043] dark:border-[#4bd043] hover:bg-[#138601] hover:text-white dark:hover:bg-[#138601] dark:hover:text-white px-4 py-2 rounded-xl font-bold text-xs tracking-wider transition-all whitespace-nowrap uppercase shadow-sm"
          >
            Portal
          </a>
        </div>
      </div>
    </nav>
  );
};

export default DesktopNav;
