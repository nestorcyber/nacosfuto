import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import ScrollToTopLink from "../ScrollToTopLink";

/**
 * Full-screen overlay displaying categorized course resources
 */
const ResourcesOverlay = ({ isOpen, closeOverlay }) => {
  const location = useLocation();

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
    ],
  };

  if (!isOpen) return null;

  const isDesktop = window.innerWidth >= 768;
  const forceDark = isDesktop;
  const isLight =
    !forceDark &&
    (document.body.classList.contains("light") ||
      (window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches));

  return (
    <div
      className={`fixed inset-0 z-40 pt-16 overflow-y-auto ${
        forceDark
          ? "bg-gray-800 dark:bg-gray-900"
          : isLight
          ? "bg-white"
          : "bg-gray-800 dark:bg-gray-900"
      }`}
      style={
        isLight && !forceDark ? { boxShadow: "0 0 0 100vmax #fff inset" } : {}
      }
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-end mb-8">
          <button
            onClick={closeOverlay}
            className={
              forceDark
                ? "text-white p-2 hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
                : isLight
                ? "text-[#07160c] p-2 hover:bg-green-50 rounded-full transition-colors cursor-pointer"
                : "text-white p-2 hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
            }
            aria-label="Close resources menu"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(resources).map(([category, items]) => (
            <div
              key={category}
              className={
                forceDark
                  ? "bg-gray-700 dark:bg-gray-800 p-3 rounded-lg shadow-lg"
                  : isLight
                  ? "bg-white p-5 rounded-xl shadow-md border border-gray-100"
                  : "bg-gray-700 dark:bg-gray-800 p-3 rounded-lg shadow-lg"
              }
            >
              <h3
                className={
                  forceDark
                    ? "text-base font-bold text-green-400 mb-2 border-b border-gray-600 pb-1"
                    : isLight
                    ? "text-lg font-bold text-[#07160c] mb-3 border-b border-gray-200 pb-2"
                    : "text-base font-bold text-green-900 dark:text-green-400 mb-2 border-b border-gray-600 pb-1"
                }
              >
                {category}
              </h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.link}>
                    {item.link.startsWith("http") ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block py-2 px-3 rounded transition-colors text-base font-medium ${
                          forceDark
                            ? "text-white hover:bg-gray-600"
                            : isLight
                            ? "text-[#07160c] hover:bg-green-50"
                            : "text-white hover:bg-gray-600"
                        }`}
                        onClick={closeOverlay}
                      >
                        {item.name}
                      </a>
                    ) : (
                      <ScrollToTopLink
                        to={item.link}
                        className={`block py-2 px-3 rounded transition-colors text-base font-medium ${
                          location.pathname === item.link
                            ? "bg-green-700 text-white"
                            : forceDark
                            ? "text-white hover:bg-gray-600"
                            : isLight
                            ? "text-[#07160c] hover:bg-green-50"
                            : "text-white hover:bg-gray-600"
                        }`}
                        onClick={closeOverlay}
                      >
                        {item.name}
                      </ScrollToTopLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesOverlay;
