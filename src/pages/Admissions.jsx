import React, { useEffect, useRef } from "react";
import { FaGraduationCap, FaUserGraduate, FaFileAlt, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";
import { gsap } from "gsap";
import ScrollToTopLink from "../components/ScrollToTopLink";
import admissionsImage from "../assets/admissions.jpg";
import Footer from "../components/Footer";
import Navbar from "../components/Nav/Navbar";

const Admissions = () => {
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

  const admissionTypes = [
    {
      icon: <FaGraduationCap className="text-green-400 text-3xl" />,
      title: "Undergraduate",
      description: "Bachelor of Science in Computer Science",
      requirements: [
        "5 O'level credits including Math, English, and Physics",
        "Minimum UTME score of 200",
        "Post-UTME screening"
      ],
      link: "/admissions/undergraduate"
    },
    {
      icon: <FaUserGraduate className="text-green-400 text-3xl" />,
      title: "Postgraduate",
      description: "MSc and PhD programs in Computer Science",
      requirements: [
        "First degree with minimum of Second Class Lower",
        "Transcript from previous institution",
        "NYSC discharge certificate"
      ],
      link: "/admissions/postgraduate"
    },
    {
      icon: <FaFileAlt className="text-green-400 text-3xl" />,
      title: "Direct Entry",
      description: "Advanced entry for diploma/NCE holders",
      requirements: [
        "OND/HND/NCE with minimum of Lower Credit",
        "Relevant subjects in qualification",
        "JAMB Direct Entry form"
      ],
      link: "/admissions/direct-entry"
    }
  ];

  const admissionTimeline = [
    {
      step: "1",
      title: "Application",
      description: "Submit online application through FUTO portal",
      duration: "July - August"
    },
    {
      step: "2",
      title: "Screening",
      description: "Participate in online post-UTME screening exercise",
      duration: "September - October"
    },
    {
      step: "3",
      title: "Admission List",
      description: "Check admission status on JAMB/CAPs",
      duration: "November"
    },
    {
      step: "4",
      title: "Registration",
      description: "Complete physical registration and documentation",
      duration: "January"
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
                Admissions <span className="text-green-400">Information</span>
              </h1>
              <p className="text-lg text-gray-800 dark:text-gray-300 mb-8">
                Join one of Nigeria's premier computer science programs. Learn about
                requirements, deadlines, and how to apply to FUTO's Department of
                Computer Science.
              </p>
              <div className="flex space-x-4">
                <ScrollToTopLink
                  to="/programs"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  View Programs
                </ScrollToTopLink>
                <ScrollToTopLink
                  to="/apply"
                  className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Apply Now
                </ScrollToTopLink>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img
                src={admissionsImage}
                alt="FUTO Admissions"
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
              Admission <span className="text-green-400">Pathways</span>
            </h2>
            <div className="w-20 h-1 bg-green-500 mx-auto mt-10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {admissionTypes.map((type, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-700 p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="mb-4">{type.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {type.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{type.description}</p>
                <h4 className="font-medium text-gray-800 dark:text-white mb-2">Requirements:</h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300 mb-6">
                  {type.requirements.map((req, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
                <ScrollToTopLink
                  to={type.link}
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
              Admission <span className="text-green-400">Timeline</span>
            </h2>
            <div className="w-20 h-1 bg-green-500 mx-auto mt-10"></div>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 h-full w-0.5 bg-green-500 transform -translate-x-1/2"></div>
            <div className="space-y-8">
              {admissionTimeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`w-5/12 p-6 rounded-xl shadow-md ${index % 2 === 0 ? 'bg-white dark:bg-gray-800 ml-auto mr-8' : 'bg-green-50 dark:bg-gray-700 mr-auto ml-8'}`}>
                    <div className="absolute top-6 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white font-bold" style={{ left: '50%', transform: 'translateX(-50%)' }}>
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {item.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FaCalendarAlt className="mr-2 text-green-500" />
                      {item.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                Tuition & Fees
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span className="text-gray-600 dark:text-gray-300">Undergraduate</span>
                  <span className="font-medium text-gray-800 dark:text-white">₦180,000/session</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span className="text-gray-600 dark:text-gray-300">Postgraduate</span>
                  <span className="font-medium text-gray-800 dark:text-white">₦200,000/session</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span className="text-gray-600 dark:text-gray-300">Acceptance Fee</span>
                  <span className="font-medium text-gray-800 dark:text-white">₦50,000 (one-time)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Other Charges</span>
                  <span className="font-medium text-gray-800 dark:text-white">₦20,000/session</span>
                </div>
              </div>
              <div className="mt-6 bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 dark:text-white mb-2">Scholarships Available</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Merit-based and need-based scholarships can cover up to 100% of tuition.
                </p>
                <ScrollToTopLink
                  to="/scholarships"
                  className="inline-block mt-2 text-green-500 hover:text-green-600 font-medium transition-colors"
                >
                  Learn about scholarships →
                </ScrollToTopLink>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                International Students
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We welcome students from across Africa and around the world. International applicants
                should review these additional requirements:
              </p>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300 mb-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Proof of English proficiency (TOEFL/IELTS) if applicable</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Equivalent academic qualifications verified by NUC</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Student visa and residency documentation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Medical clearance and immunization records</span>
                </li>
              </ul>
              <ScrollToTopLink
                to="/international"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                International Admissions
              </ScrollToTopLink>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Admissions;