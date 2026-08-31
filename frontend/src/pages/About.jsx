import React, { useEffect, useRef } from "react";
import { FaLaptopCode, FaBook, FaUniversity, FaMapMarkerAlt, FaCalendarAlt, FaWater } from "react-icons/fa";
import { MdComputer } from "react-icons/md";
import { gsap } from "gsap";
import ScrollToTopLink from "../components/ScrollToTopLink";
import departmentImage from "../assets/department.jpg";
import Footer from "../components/Footer";
import Navbar from "../components/Nav/Navbar";
import DepartmentStats from "../components/Home/DepartmentStats";

const About = () => {
  const titleRefs = useRef([]);
  titleRefs.current = [];

  // Add refs for animation targets
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
    document.body.style.overflow = 'auto'; // force-enable scroll
  }, []);



  // Features remain mostly the same, adjusted slightly
  const features = [
    {
      icon: <FaLaptopCode className="text-green-400 text-2xl" />,
      title: "Industry-Relevant Curriculum",
      description:
        "Courses covering AI, Big Data, Cybersecurity, Cloud Computing, and more, updated to meet global tech standards.",
    },
    {
      icon: <MdComputer className="text-green-400 text-2xl" />,
      title: "Modern Computing Labs",
      description:
        "Equipped with current-generation hardware and software tools for hands-on learning and research.",
    },
    {
      icon: <FaBook className="text-green-400 text-2xl" />,
      title: "Active Research Programs",
      description:
        "Engage in projects advancing technology in Nigeria and beyond, supported by faculty expertise and grants.",
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
                className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-gray-300"
              >
                Department of{" "}
                <span className="text-green-400">Computer Science</span>
              </h1>
              <p className="text-lg text-gray-800 dark:text-gray-300 mb-8">
                At the Federal University of Technology Owerri, we are committed
                to nurturing tech innovators and researchers who will drive
                Nigeria’s digital future.
              </p>
              <ScrollToTopLink
                to="/programs"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Explore Our Programs
              </ScrollToTopLink>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img
                src={departmentImage}
                alt="FUTO Computer Science Department"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      {/* 1. About Department Section (Department Overview & Startup) */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              ref={addToRefs}
              className="text-3xl font-bold text-gray-800 dark:text-white"
            >
              About <span className="text-green-400">Our Department</span>
            </h2>
            <div className="w-20 h-1 bg-green-500 mx-auto mt-10"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <h3
                ref={addToRefs}
                className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-3"
              >
                <FaLaptopCode className="text-green-500" /> Department of Computer Science Overview
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                The Department of Computer Science at the Federal University of Technology Owerri (FUTO) is a premier center of excellence for computing education, software engineering, and technological research in West Africa. We are dedicated to equipping students with theoretical foundations and practical skills required to lead in Artificial Intelligence, Cybersecurity, Data Science, Cloud Computing, and Software Development.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                As part of the School of Information and Communication Technology (SICT) established in 2018, the department earned full National Universities Commission (NUC) accreditation in 2021. Through rigorous academic coursework, industry partnerships, hands-on lab experiences, and active student tech communities like NACOS FUTO, our graduates consistently excel as software engineers, tech founders, and researchers worldwide.
              </p>

              {/* Department Startup & Milestones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-200 dark:border-green-800">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-2 text-lg">School of ICT Integration (2018)</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    Integrated into the newly created School of Information and Communication Technology (SICT) to foster interdisciplinary tech innovation and specialized computing research.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-200 dark:border-green-800">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-2 text-lg">Full NUC Accreditation (2021)</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    Awarded top-tier full accreditation by the National Universities Commission (NUC), certifying high academic quality, modern laboratory facilities, and outstanding faculty standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Why Study Computer Science at FUTO */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              ref={addToRefs}
              className="text-3xl font-bold text-gray-800 dark:text-white"
            >
              Why Study <span className="text-green-400">Computer Science at FUTO</span>
            </h2>
            <div className="w-20 h-1 bg-green-500 mx-auto mt-10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-all border-l-4 border-green-500"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Department Stats */}
      <DepartmentStats />

      {/* 4. FUTO History & University Details (Comes After Department Details) */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              ref={addToRefs}
              className="text-3xl font-bold text-gray-800 dark:text-white"
            >
              History of <span className="text-green-400">FUTO</span>
            </h2>
            <div className="w-20 h-1 bg-green-500 mx-auto mt-10"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              FUTO, as the Oldest University of Technology in Nigeria, was established in 1980 by Executive fiat with the composition and appointment of the first provisional Council by Nigeria's First Executive President, Shehu Shagari. It became the first of three such Universities set up by the Federal Government of Nigeria who sought to establish a University of Technology in each geo-political region and particularly in a State which did not have a conventional University.
            </p>

            {/* FUTO History Milestones */}
            <div className="space-y-6 mb-10">
              <div className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                  <FaCalendarAlt />
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl flex-1">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-1">November 28, 1980</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    On the premises of the Old Government Technical College (GTC), FUTO opened its doors to staff and students.
                  </p>
                </div>
              </div>
              <div className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                  <FaCalendarAlt />
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl flex-1">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-1">January 1982</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    The Imo State government approved a permanent site for the University. FUTO engaged Messrs Concarplan – Enplan Group to design the physical plan for the University.
                  </p>
                </div>
              </div>
              <div className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                  <FaMapMarkerAlt />
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl flex-1">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-1">The Permanent Site</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    Located 25 kilometers south of Owerri, the site selection was guided by the National Universities Commission's advice that a minimum of 10,000 acres (4,048 hectares) be obtained, based on location, relative absence of human settlements, and other relevant factors.
                  </p>
                </div>
              </div>
            </div>

            {/* Host Communities */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 mb-8 border border-green-200 dark:border-green-800">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                <FaUniversity className="text-green-600" /> Host Communities
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                FUTO is surrounded by autonomous communities and homesteads that contributed land for the development of the University:
              </p>
              <div className="flex flex-wrap gap-2">
                {["Ihiagwa", "Obinze", "Umuoma", "Nekede", "Eziobodo", "Avu", "Okolochi", "Obibiezena", "Emeabiam"].map((c) => (
                  <span key={c} className="inline-block px-3 py-1 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium shadow-sm border border-green-200 dark:border-green-700">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Otamiri River */}
            <div className="flex gap-4 items-start p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                <FaWater />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-1">The Otamiri River</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  The Otamiri River traverses the site from North to South and, with the beautiful vegetation in its river basin, forms an important physical feature of the campus landscape.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FUTO Mission & Vision */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              FUTO <span className="text-green-400">Mission & Vision</span>
            </h2>
            <div className="w-20 h-1 bg-green-500 mx-auto mt-6 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border-t-4 border-green-500">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mr-4">
                  V
                </span>
                Our Vision
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                To re-engineer and re-position the Federal University of Technology to be a truly world class university through recreating, nurturing and developing uniquely promising students and exceptional staff in Science, Technology and enterprise to the benefit of our globalized world.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border-t-4 border-green-500">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mr-4">
                  M
                </span>
                Our Mission
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                To operate practical and training geared towards transforming the nation's economy from consumer-oriented to production-oriented, with a sound technological base.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
