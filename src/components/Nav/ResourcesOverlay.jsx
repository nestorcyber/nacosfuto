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

  return (
    <div
      className="fixed inset-0 z-40 pt-16 overflow-y-auto bg-white/95 dark:bg-[#041801]/98 backdrop-blur-xl transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-end mb-8">
          <button
            onClick={closeOverlay}
            className="p-2 rounded-full transition-colors cursor-pointer text-[#083002] dark:text-white hover:bg-[#f2fbf1] dark:hover:bg-[#083002]"
            aria-label="Close resources menu"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(resources).map(([category, items]) => (
            <div
              key={category}
              className="p-5 rounded-2xl shadow-lg border bg-[#f2fbf1] dark:bg-[#083002] border-[#138601]/20 dark:border-[#138601]/30 transition-all"
            >
              <h3
                className="text-base font-extrabold mb-3 border-b pb-2 uppercase tracking-wider text-[#138601] dark:text-[#4bd043] border-[#138601]/20 dark:border-[#138601]/30"
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
                        className="block py-2 px-3 rounded-lg transition-colors text-sm font-medium text-[#083002]/90 dark:text-green-100 hover:bg-[#138601] hover:text-white"
                        onClick={closeOverlay}
                      >
                        {item.name}
                      </a>
                    ) : (
                      <ScrollToTopLink
                        to={item.link}
                        className={`block py-2 px-3 rounded-lg transition-colors text-sm font-medium ${
                          location.pathname === item.link
                            ? "bg-[#138601] text-white"
                            : "text-[#083002]/90 dark:text-green-100 hover:bg-[#138601] hover:text-white"
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
