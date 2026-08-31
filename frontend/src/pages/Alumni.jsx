import React, { useEffect, useRef } from "react";
import { FaUserGraduate, FaBriefcase, FaGlobeAfrica, FaAward, FaUsers, FaLinkedin } from "react-icons/fa";
import { gsap } from "gsap";
import ScrollToTopLink from "../components/ScrollToTopLink";
import alumniImage from "../assets/alumni.jpg";
import benitaImg from "../assets/alumni_benita.jpg";
import godfirstImg from "../assets/alumni_godfirst.jpg";
import Footer from "../components/Footer";
import Navbar from "../components/Nav/Navbar";

const Alumni = () => {
  const titleRefs = useRef([]);
  titleRefs.current = [];

  const addToRefs = (el) => {
    if (el && !titleRefs.current.includes(el)) {
      titleRefs.current.push(el);
    }
  };

  useEffect(() => {
    gsap.from(titleRefs.current, {
      opacity: 0.8,
      y: 30,
      stagger: 0.3,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'auto';
  }, []);

  const alumniStats = [
    {
      value: "10,000+",
      label: "Alumni Worldwide",
      icon: <FaUsers className="text-green-400 text-3xl" />
    },
    {
      value: "40+",
      label: "Countries Represented",
      icon: <FaGlobeAfrica className="text-green-400 text-3xl" />
    },
    {
      value: "30%",
      label: "Tech Entrepreneurs",
      icon: <FaBriefcase className="text-green-400 text-3xl" />
    },
    {
      value: "50+",
      label: "Industry Awards",
      icon: <FaAward className="text-green-400 text-3xl" />
    }
  ];

  const notableAlumni = [
    {
      name: "Godfirst Onuoha",
      position: "Tech Leader & Community Builder",
      achievement: "Community • Coding • Volunteering",
      linkedin: "https://www.linkedin.com/in/godfirstonuoha/",
      image: godfirstImg
    },
    {
      name: "Benita Nwabueze",
      position: "Cybersecurity Analyst",
      achievement: "Securing modern enterprise infrastructure and digital assets",
      linkedin: "https://www.linkedin.com/in/nwabueze-benita/",
      image: benitaImg
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <section className="relative py-20 bg-white dark:bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1
                ref={addToRefs}
                className="text-4xl md:text-5xl font-bold mb-12 text-gray-800 dark:text-gray-300"
              >
                FUTO CSC <span className="text-green-400">Alumni Network</span>
              </h1>
              <p className="text-lg text-gray-800 dark:text-gray-300 mb-8">
                Connecting generations of computer scientists who are shaping the future
                of technology in Nigeria and around the world.
              </p>
              <div className="flex space-x-4">
                <ScrollToTopLink
                  to="/alumni/register"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Join Alumni Network
                </ScrollToTopLink>
                <ScrollToTopLink
                  to="/alumni/events"
                  className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Upcoming Events
                </ScrollToTopLink>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img
                src={alumniImage}
                alt="FUTO Computer Science Alumni"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              ref={addToRefs}
              className="text-3xl font-bold text-gray-800 dark:text-white"
            >
              Alumni <span className="text-green-400">Impact</span>
            </h2>
            <div className="w-20 h-1 bg-green-500 mx-auto mt-10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {alumniStats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl text-center shadow-md hover:shadow-lg transition-shadow"
              >
                {stat.icon}
                <h4 className="text-2xl font-bold text-gray-800 dark:text-white mt-3">
                  {stat.value}
                </h4>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              ref={addToRefs}
              className="text-3xl font-bold text-gray-800 dark:text-white"
            >
              Notable <span className="text-green-400">Alumni</span>
            </h2>
            <div className="w-20 h-1 bg-green-500 mx-auto mt-10"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {notableAlumni.map((alum, index) => (
              <div
                key={index}
                className="group w-full max-w-[320px] flex flex-col bg-white dark:bg-gray-800 p-5 rounded-2xl border-2 border-green-800/40 dark:border-green-600/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Square Bounding Box for Image */}
                <div className="w-full aspect-square overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900/60 flex items-center justify-center relative">
                  {alum.image ? (
                    <img 
                      src={alum.image} 
                      alt={alum.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-green-500 p-4">
                      <FaUserGraduate className="text-6xl opacity-60 mb-2" />
                    </div>
                  )}
                </div>

                {/* Divider Line */}
                <div className="border-t my-4 border-gray-200 dark:border-gray-700"></div>

                {/* Details Section */}
                <div className="flex flex-col flex-grow text-center items-center">
                  <h3 className="font-black text-xl tracking-tight text-gray-950 dark:text-white uppercase line-clamp-1">
                    {alum.name}
                  </h3>

                  <p className="text-xs font-extrabold uppercase tracking-wider text-green-600 dark:text-green-400 mt-1 mb-2">
                    {alum.position}
                  </p>

                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic line-clamp-2 mb-4">
                    {alum.achievement}
                  </p>

                  {/* Social Handle Button - Bottom of card */}
                  {alum.linkedin && (
                    <div className="pt-3 border-t w-full border-gray-150 dark:border-gray-700/60 mt-auto flex justify-center">
                      <a
                        href={alum.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow hover:shadow-blue-500/20"
                        title={`Connect with ${alum.name} on LinkedIn`}
                      >
                        <FaLinkedin className="text-sm" /> LinkedIn
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                Alumni Benefits
              </h3>
              <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  <span>Exclusive networking events and reunions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  <span>Career development resources and job postings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  <span>Continued access to department resources and library</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  <span>Opportunities to mentor current students</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  <span>Discounts on conferences and professional development</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                Give Back
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                There are many ways to support current students and the department:
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-gray-800 dark:text-white">Scholarships</h4>
                  <p className="text-gray-600 dark:text-gray-300">Fund scholarships for deserving students</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-gray-800 dark:text-white">Guest Lectures</h4>
                  <p className="text-gray-600 dark:text-gray-300">Share your expertise with students</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-gray-800 dark:text-white">Internships</h4>
                  <p className="text-gray-600 dark:text-gray-300">Offer internships at your organization</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-gray-800 dark:text-white">Equipment Donations</h4>
                  <p className="text-gray-600 dark:text-gray-300">Help upgrade our labs and facilities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Alumni;