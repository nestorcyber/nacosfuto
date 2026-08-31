import React, { useEffect, useRef } from "react";
import {
  FaUsers,
  FaTrophy,
  FaMusic,
  FaMicrophone,
  FaLaptopCode,
} from "react-icons/fa";
import { MdSportsVolleyball, MdScience } from "react-icons/md";
import { gsap } from "gsap";
import ScrollToTopLink from "../components/ScrollToTopLink";
import studentLifeImage from "../assets/student-life.jpg";
import Footer from "../components/Footer";
import Navbar from "../components/Nav/Navbar";

const StudentLife = () => {
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
    document.body.style.overflow = "auto";
  }, []);

  const clubs = [
    {
      icon: <FaLaptopCode className="text-green-400 text-2xl" />,
      title: "Developer Student Club",
      description:
        "Google-supported community for developers to learn and build solutions",
    },
    {
      icon: <MdScience className="text-green-400 text-2xl" />,
      title: "Tech Innovators Club",
      description:
        "For students interested in research and innovation projects",
    },
    {
      icon: <FaMicrophone className="text-green-400 text-2xl" />,
      title: "Public Speaking Club",
      description: "Develop communication and presentation skills",
    },
    {
      icon: <MdSportsVolleyball className="text-green-400 text-2xl" />,
      title: "Sports & Recreation",
      description: "Football, basketball, table tennis and more",
    },
  ];

  const events = [
    {
      month: "SEP",
      title: "Tech Week",
      description: "Annual technology festival with hackathons and workshops",
    },
    {
      month: "NOV",
      title: "Career Fair",
      description: "Connect with top tech companies and recruiters",
    },
    {
      month: "FEB",
      title: "Science Week",
      description: "Showcase of student research projects and innovations",
    },
    {
      month: "APR",
      title: "Cultural Day",
      description: "Celebration of Nigeria's diverse cultures and traditions",
    },
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
                Student <span className="text-green-400">Life</span>
              </h1>
              <p className="text-lg text-gray-800 dark:text-gray-300 mb-8">
                Beyond academics, we offer a vibrant campus life with
                opportunities for personal growth, leadership development, and
                unforgettable experiences.
              </p>
              <ScrollToTopLink
                to="/clubs"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Explore Clubs & Activities
              </ScrollToTopLink>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img
                src={studentLifeImage}
                alt="FUTO Student Life"
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
              Campus <span className="text-green-400">Clubs</span>
            </h2>
            <div className="w-20 h-1 bg-green-500 mx-auto mt-10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {clubs.map((club, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-700 p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="mb-4">{club.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                  {club.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {club.description}
                </p>
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
              Annual <span className="text-green-400">Events</span>
            </h2>
            <div className="w-20 h-1 bg-green-500 mx-auto mt-10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {events.map((event, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border-t-4 border-green-500"
              >
                <div className="text-green-500 font-bold text-xl mb-2">
                  {event.month}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2
                ref={addToRefs}
                className="text-3xl font-bold text-gray-800 dark:text-white mb-6"
              >
                Student <span className="text-green-400">Support</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                We provide comprehensive support services to help students
                thrive academically and personally throughout their university
                journey.
              </p>
              <div className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    Academic Advising
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Dedicated faculty advisors to guide your academic progress
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    Career Services
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Resume workshops, interview prep, and job placement support
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    Mental Health Resources
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Counseling services and wellness programs
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h2
                ref={addToRefs}
                className="text-3xl font-bold text-gray-800 dark:text-white mb-6"
              >
                Campus <span className="text-green-400">Facilities</span>
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    24/7 Computer Labs
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Access to high-performance computing resources
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    Innovation Hub
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Collaborative space for student projects
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    Sports Complex
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Football field, basketball courts, and gym
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    Student Lounge
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Relaxation and social space
                  </p>
                </div>
              </div>
              <div className="mt-6 bg-green-100 dark:bg-green-900 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white">
                  Student Housing
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Comfortable on-campus accommodation with 24/7 security
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StudentLife;
