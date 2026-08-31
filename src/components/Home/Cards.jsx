import React from 'react';
import { FaUserGraduate, FaLaptopCode, FaChartPie, FaArrowRight } from 'react-icons/fa';
import ScrollToTopLink from '../ScrollToTopLink';

const Cards = () => {
  const quickAccessLinks = [
    {
      icon: <FaUserGraduate />,
      title: "Prospective Students",
      description: "Discover our curriculum, admission requirements, and what it takes to join the next generation of tech leaders at FUTO.",
      link: "/admissions",
      gradient: "from-green-500 to-emerald-400"
    },
    {
      icon: <FaLaptopCode />,
      title: "Portal & Materials",
      description: "Your centralized hub. Access lecture notes, check results, and manage your academic records seamlessly in one secure place.",
      link: "/dashboard",
      gradient: "from-blue-500 to-indigo-400"
    },
    {
      icon: <FaChartPie />,
      title: "Academic Analytics",
      description: "Calculate your CGPA effortlessly and track your academic progress over time with our powerful visual analytics tools.",
      link: "/academic-analytics",
      gradient: "from-purple-500 to-pink-400"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            Quick <span className="text-green-500">Access</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-lg">
            Essential tools and resources tailored for our community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {quickAccessLinks.map((item, index) => (
            <ScrollToTopLink
              key={index}
              to={item.link}
              className="group relative bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 hover:border-transparent transition-all duration-500 flex flex-col h-full overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Gradient Hover Background */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br ${item.gradient}`} />
              
              {/* Icon Container */}
              <div className="mb-8 relative">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white text-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                  {item.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-emerald-500 transition-all duration-300">
                {item.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 flex-grow">
                {item.description}
              </p>

              {/* Action Indicator */}
              <div className="mt-auto flex items-center text-sm font-bold uppercase tracking-wider text-gray-400 group-hover:text-green-500 transition-colors duration-300">
                <span>Explore</span>
                <FaArrowRight className="ml-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
              </div>
            </ScrollToTopLink>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Cards;