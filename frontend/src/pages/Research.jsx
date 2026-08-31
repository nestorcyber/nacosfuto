import React, { useEffect, useRef } from "react";
import { FaFlask, FaMicroscope, FaBookOpen, FaChartLine, FaUsers } from "react-icons/fa";
import { MdComputer, MdScience } from "react-icons/md";
import { gsap } from "gsap";
import ScrollToTopLink from "../components/ScrollToTopLink";
import researchImage from "../assets/research.jpg";
import Footer from "../components/Footer";
import Navbar from "../components/Nav/Navbar";

const Research = () => {
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

  const researchAreas = [
    {
      icon: <FaFlask className="text-green-400 text-3xl" />,
      title: "Artificial Intelligence",
      description: "Exploring machine learning, neural networks, and AI applications for African contexts."
    },
    {
      icon: <MdComputer className="text-green-400 text-3xl" />,
      title: "Cybersecurity",
      description: "Developing solutions for secure digital infrastructure in Nigeria and beyond."
    },
    {
      icon: <FaChartLine className="text-green-400 text-3xl" />,
      title: "Data Science",
      description: "Big data analytics and visualization for business and government applications."
    },
    {
      icon: <FaMicroscope className="text-green-400 text-3xl" />,
      title: "Human-Computer Interaction",
      description: "Designing technology solutions that meet local user needs and cultural contexts."
    }
  ];

  const researchStats = [
    {
      value: "15+",
      label: "Ongoing Research Projects",
      icon: <FaBookOpen className="text-green-400 text-2xl" />
    },
    {
      value: "₦50M+",
      label: "Research Grants (2023)",
      icon: <FaChartLine className="text-green-400 text-2xl" />
    },
    {
      value: "30+",
      label: "Published Papers (2023)",
      icon: <FaBookOpen className="text-green-400 text-2xl" />
    },
    {
      value: "10+",
      label: "Industry Collaborations",
      icon: <FaUsers className="text-green-400 text-2xl" />
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
                Research & <span className="text-green-400">Innovation</span>
              </h1>
              <p className="text-lg text-gray-800 dark:text-gray-300 mb-8">
                Advancing the frontiers of computer science through cutting-edge research
                that addresses real-world challenges in Nigeria and Africa.
              </p>
              <ScrollToTopLink
                to="/contact"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Collaborate With Us
              </ScrollToTopLink>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img
                src={researchImage}
                alt="FUTO Computer Science Research"
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
              Our <span className="text-green-400">Research Focus</span>
            </h2>
            <div className="w-20 h-1 bg-green-500 mx-auto mt-10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {researchAreas.map((area, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-700 p-8 rounded-xl hover:shadow-lg transition-all"
              >
                <div className="mb-4">{area.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                  {area.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{area.description}</p>
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
              Research <span className="text-green-400">Impact</span>
            </h2>
            <div className="w-20 h-1 bg-green-500 mx-auto mt-10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {researchStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl text-center shadow-md hover:shadow-lg transition-shadow border-b-4 border-green-500"
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

      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                ref={addToRefs}
                className="text-3xl font-bold text-gray-800 dark:text-white mb-6"
              >
                Research <span className="text-green-400">Facilities</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Our department boasts state-of-the-art research facilities including:
              </p>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>High-performance computing cluster with GPU acceleration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Cybersecurity research lab with isolated network environment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Human-computer interaction lab with eye-tracking and VR equipment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Data science lab with access to large datasets and visualization tools</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                Research Opportunities
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We offer various opportunities for students and external researchers:
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-gray-800 dark:text-white">Undergraduate Research</h4>
                  <p className="text-gray-600 dark:text-gray-300">Work with faculty on cutting-edge projects</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-gray-800 dark:text-white">MSc/PhD Programs</h4>
                  <p className="text-gray-600 dark:text-gray-300">Join our postgraduate research programs</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-gray-800 dark:text-white">Industry Collaboration</h4>
                  <p className="text-gray-600 dark:text-gray-300">Partner with us to solve real-world problems</p>
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

export default Research;