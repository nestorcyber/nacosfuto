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
      gradient: "from-[#138601] to-[#3db92c]"
    },
    {
      icon: <FaLaptopCode />,
      title: "Learning Resources",
      description: "Access curated lecture notes, textbook materials, video lectures, and recommended study resources in one convenient hub.",
      link: "/resources",
      gradient: "from-[#0f6c01] to-[#138601]"
    },
    {
      icon: <FaChartPie />,
      title: "Department Overview",
      description: "Learn about our rich 40+ year history, esteemed faculty members, administration, research facilities, and student community.",
      link: "/about",
      gradient: "from-[#138601] to-emerald-500"
    }
  ];

  return (
    <section className="py-24 bg-[#f4faf3] dark:bg-[#041801] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#083002] dark:text-white tracking-tight mb-4">
            Quick <span className="text-[#138601] dark:text-[#4bd043]">Access</span>
          </h2>
          <p className="text-[#083002]/70 dark:text-green-100/70 max-w-2xl text-lg">
            Essential tools, resources, and links tailored for our community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {quickAccessLinks.map((item, index) => (
            <ScrollToTopLink
              key={index}
              to={item.link}
              className="group relative bg-white dark:bg-[#083002] rounded-3xl p-8 border border-[#138601]/20 dark:border-[#138601]/30 hover:border-[#138601] dark:hover:border-[#4bd043] transition-all duration-500 flex flex-col h-full overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Icon Container */}
              <div className="mb-8 relative">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white text-2xl shadow-lg shadow-[#138601]/30 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                  {item.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-[#083002] dark:text-white mb-4 group-hover:text-[#138601] dark:group-hover:text-[#4bd043] transition-colors duration-300">
                {item.title}
              </h3>
              
              <p className="text-[#083002]/75 dark:text-green-100/75 leading-relaxed mb-8 flex-grow">
                {item.description}
              </p>

              {/* Action Indicator */}
              <div className="mt-auto flex items-center text-sm font-bold uppercase tracking-wider text-[#138601] dark:text-[#4bd043] transition-colors duration-300">
                <span>Explore</span>
                <FaArrowRight className="ml-2 transform group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </ScrollToTopLink>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Cards;
