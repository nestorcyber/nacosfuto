import React, { useEffect, useRef } from "react";
import { FaLaptopCode, FaRobot, FaShieldAlt, FaUsers, FaChartLine, FaGamepad } from "react-icons/fa";
import { gsap } from "gsap";
import ScrollToTopLink from "../components/ScrollToTopLink";
import clubsImage from "../assets/clubs.jpg";
import Footer from "../components/Footer";
import Navbar from "../components/Nav/Navbar";

const Clubs = () => {
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

  const techClubs = [
    {
      icon: <FaLaptopCode className="text-green-400 text-3xl" />,
      name: "Developer Student Club",
      description: "Google-supported community for developers to learn and build solutions",
      meeting: "Every Tuesday, 3pm @ CS Lab 3"
    },
    {
      icon: <FaRobot className="text-green-400 text-3xl" />,
      name: "AI & Robotics Club",
      description: "Explore artificial intelligence and build intelligent systems",
      meeting: "Every Thursday, 4pm @ Innovation Hub"
    },
    {
      icon: <FaShieldAlt className="text-green-400 text-3xl" />,
      name: "Cybersecurity Club",
      description: "Learn about security, ethical hacking, and cyber defense",
      meeting: "Every Wednesday, 2pm @ CS Lab 2"
    },
    {
      icon: <FaChartLine className="text-green-400 text-3xl" />,
      name: "Data Science Society",
      description: "Work with big data, analytics, and visualization tools",
      meeting: "Every Friday, 1pm @ CS Lab 1"
    },
    {
      icon: <FaGamepad className="text-green-400 text-3xl" />,
      name: "Game Development Club",
      description: "Create games using Unity, Unreal Engine, and other platforms",
      meeting: "Every Monday, 5pm @ CS Lab 4"
    },
    {
      icon: <FaUsers className="text-green-400 text-3xl" />,
      name: "Women in Tech",
      description: "Supporting female students in technology fields",
      meeting: "Bi-weekly Saturdays, 10am @ SICT Building"
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
                className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-gray-300"
              >
                Student <span className="text-green-400">Clubs</span>
              </h1>
              <p className="text-lg text-gray-800 dark:text-gray-300 mb-8">
                Join our vibrant tech communities to enhance your skills, network with peers,
                and work on exciting projects beyond the classroom.
              </p>
              <ScrollToTopLink
                to="/student-life"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Explore Student Life
              </ScrollToTopLink>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img
                src={clubsImage}
                alt="FUTO Student Clubs"
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
              Technical <span className="text-green-400">Clubs</span>
            </h2>
            <div className="w-20 h-1 bg-green-500 mx-auto mt-10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {techClubs.map((club, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-700 p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="mb-4">{club.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                  {club.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{club.description}</p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {club.meeting}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                Start Your Own Club
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Have an idea for a new student organization? We support student-led initiatives
                that align with our academic mission.
              </p>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300 mb-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Find at least 10 interested members</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Identify a faculty advisor</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Submit a proposal to the Student Affairs office</span>
                </li>
              </ul>
              <ScrollToTopLink
                to="/contact"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Get Started
              </ScrollToTopLink>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                Club Resources
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Registered clubs have access to various university resources:
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 dark:text-white">Meeting Spaces</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Book classrooms and labs</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 dark:text-white">Funding</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Apply for activity grants</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 dark:text-white">Event Support</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Promotion and logistics</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 dark:text-white">Mentorship</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Faculty guidance</p>
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

export default Clubs;