import React from 'react';
import { FaGraduationCap, FaLaptopCode, FaChartPie, FaArrowRight } from 'react-icons/fa';
import ScrollToTopLink from '../ScrollToTopLink';

const Cards = () => {
  const quickAccessLinks = [
    {
      icon: <FaGraduationCap />,
      title: "Admissions & Programs",
      description: "Discover our curriculum, degree options, admission requirements, and what it takes to join the next generation of tech leaders.",
      link: "/admissions",
    },
    {
      icon: <FaLaptopCode />,
      title: "Learning Resources",
      description: "Access curated lecture notes, textbook materials, video lectures, and recommended study resources in one convenient hub.",
      link: "/resources",
    },
    {
      icon: <FaChartPie />,
      title: "Department Overview",
      description: "Learn about our rich 40+ year history, esteemed faculty members, administration, research facilities, and student community.",
      link: "/about",
    }
  ];

  return (
    <section className="py-20 bg-[#f4faf3] dark:bg-[#041801] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#083002] dark:text-white tracking-tight mb-3">
            Academic & Community <span className="text-[#138601] dark:text-[#4bd043]">Gateways</span>
          </h2>
          <p className="text-[#083002]/70 dark:text-green-100/70 max-w-2xl text-base leading-relaxed">
            Essential tools, academic resources, and pathways tailored for our computing community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickAccessLinks.map((item, index) => (
            <ScrollToTopLink
              key={index}
              to={item.link}
              className="group relative bg-white dark:bg-[#083002] rounded-2xl p-8 border border-[#138601]/20 dark:border-[#138601]/30 hover:border-[#138601] dark:hover:border-[#4bd043] transform hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden shadow-sm"
            >
              {/* Icon Container with smooth hover pulse */}
              <div className="mb-6 relative">
                <div className="w-12 h-12 rounded-xl bg-[#138601] group-hover:bg-[#0f6c01] flex items-center justify-center text-white text-xl shadow-md transition-all duration-300 group-hover:scale-105">
                  {item.icon}
                </div>
              </div>

              {/* Content with Webflow typography hierarchy */}
              <h3 className="text-xl font-bold text-[#083002] dark:text-white mb-3 group-hover:text-[#138601] dark:group-hover:text-[#4bd043] transition-colors duration-300 tracking-tight leading-snug">
                {item.title}
              </h3>
              
              <p className="text-sm text-[#083002]/75 dark:text-green-100/75 leading-relaxed mb-6 flex-grow">
                {item.description}
              </p>

              {/* Action Button Link (Matching 42px height, #138601, 4px rounded radius) */}
              <div className="mt-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-[#138601] group-hover:bg-[#0f6c01] rounded shadow-sm transition-colors w-fit min-h-[38px]">
                <span>Explore</span>
                <FaArrowRight className="ml-1 text-xs group-hover:translate-x-0.5 transition-transform duration-200" />
              </div>
            </ScrollToTopLink>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Cards;
