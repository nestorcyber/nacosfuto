import React, { useEffect, useRef } from "react";
import { FaBook, FaGraduationCap, FaChalkboardTeacher, FaCalendarAlt, FaUserGraduate } from "react-icons/fa";
import { MdComputer, MdScience } from "react-icons/md";
import { gsap } from "gsap";
import ScrollToTopLink from "../components/ScrollToTopLink";
import academicsImage from "../assets/academics.jpg";
import Footer from "../components/Footer";
import Navbar from "../components/Nav/Navbar";

const Academics = () => {
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

  const programs = [
    {
      icon: <FaGraduationCap className="text-green-400 text-2xl" />,
      title: "Undergraduate Programs",
      description: "BSc in Computer Science with various specializations",
      link: "/programs/undergraduate"
    },
    {
      icon: <FaUserGraduate className="text-green-400 text-2xl" />,
      title: "Postgraduate Programs",
      description: "MSc and PhD programs in advanced computing fields",
      link: "/programs/postgraduate"
    },
    {
      icon: <MdComputer className="text-green-400 text-2xl" />,
      title: "Professional Certifications",
      description: "Short courses and industry certifications",
      link: "/programs/certifications"
    }
  ];

  const curriculum = [
    {
      year: "Year 1",
      focus: "Foundations",
      courses: ["Intro to CSC", "Programming", "Discrete Math", "Computer Architecture"]
    },
    {
      year: "Year 2",
      focus: "Core Concepts",
      courses: ["Data Structures", "Algorithms", "Databases", "Operating Systems"]
    },
    {
      year: "Year 3",
      focus: "Specialization",
      courses: ["AI", "Networks", "Software Engineering", "Electives"]
    },
    {
      year: "Year 4",
      focus: "Advanced Topics",
      courses: ["Capstone Project", "Advanced Electives", "Research"]
    }
  ];

  const admissionRequirements = [
    {
      program: "Undergraduate",
      requirements: [
        "Minimum of 5 credits in SSCE/GCE including Mathematics, English, Physics and two other science subjects",
        "UTME score of at least 200",
        "Post-UTME screening pass mark"
      ]
    },
    {
      program: "Postgraduate",
      requirements: [
        "First degree in Computer Science or related field with minimum of Second Class Lower",
        "Transcript from previous institution",
        "NYSC discharge certificate"
      ]
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
                Academic <span className="text-green-400">Programs</span>
              </h1>
              <p className="text-lg text-gray-800 dark:text-gray-300 mb-8">
                Our rigorous curriculum combines theoretical foundations with
                practical applications to prepare students for successful careers
                in technology and research.
              </p>
              <div className="flex space-x-4">
                <ScrollToTopLink
                  to="/admissions"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Admissions Information
                </ScrollToTopLink>
                <ScrollToTopLink
                  to="/courses"
                  className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  View Courses
                </ScrollToTopLink>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img
                src={academicsImage}
                alt="FUTO Academics"
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
              Our <span className="text-green-400">Programs</span>
            </h2>
            <div className="w-20 h-1 bg-green-500 mx-auto mt-10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-700 p-8 rounded-xl shadow-md hover:shadow-lg transition-all border-l-4 border-green-500"
              >
                <div className="mb-4">{program.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                  {program.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{program.description}</p>
                <ScrollToTopLink
                  to={program.link}
                  className="text-green-500 hover:text-green-600 font-medium transition-colors"
                >
                  Learn more →
                </ScrollToTopLink>
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
              Curriculum <span className="text-green-400">Overview</span>
            </h2>
            <div className="w-20 h-1 bg-green-500 mx-auto mt-10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {curriculum.map((year, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="text-green-500 font-bold text-xl mb-2">{year.year}</div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  {year.focus}
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  {year.courses.map((course, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>{course}</span>
                    </li>
                  ))}
                </ul>
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
                Admission <span className="text-green-400">Requirements</span>
              </h2>
              
              {admissionRequirements.map((program, index) => (
                <div key={index} className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                    {program.program} Program
                  </h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    {program.requirements.map((req, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div>
              <h2
                ref={addToRefs}
                className="text-3xl font-bold text-gray-800 dark:text-white mb-6"
              >
                Academic <span className="text-green-400">Calendar</span>
              </h2>
              <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <FaCalendarAlt className="text-green-500 text-xl mr-3" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    2025/2026 Academic Session
                  </h3>
                </div>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <div className="border-b border-gray-200 dark:border-gray-600 pb-2">
                    <p className="font-medium">Harmattan Semester</p>
                    <p>Resumption: November 4, 2025</p>
                    <p>Lectures: Nov 4, 2025 - Feb 2026</p>
                    <p>Exams: March 2026</p>
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-600 pb-2">
                    <p className="font-medium">Rain Semester</p>
                    <p>Resumption: April 13, 2026</p>
                    <p>Lectures: April - July 2026</p>
                    <p>Exams: July - August 2026</p>
                  </div>
                  <div>
                    <p className="font-medium">Long Vacation</p>
                    <p>August - October 2026</p>
                  </div>
                </div>
                <ScrollToTopLink
                  to="/calendar"
                  className="inline-block mt-4 text-green-500 hover:text-green-600 font-medium transition-colors"
                >
                  View Full Calendar →
                </ScrollToTopLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Academics;