import React, { useState } from 'react';
import { FaQuestionCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Nav/Navbar';
import Footer from '../components/Footer';
import ScrollToTopLink from '../components/ScrollToTopLink';

const FAQsPage = () => {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I apply for admission to the Computer Science program?",
      answer: "Admission is through UTME or Direct Entry. Visit the FUTO portal to apply when admissions are open. You'll need to meet the minimum requirements including 5 credits in relevant subjects."
    },
    {
      question: "What are the career prospects for Computer Science graduates?",
      answer: "Our graduates work as software engineers, data scientists, cybersecurity experts, system analysts, and in various tech roles across industries. Many also pursue postgraduate studies or start their own tech companies."
    },
    {
      question: "Does the department offer scholarships?",
      answer: "Yes, there are several scholarship opportunities including the FUTO Merit Scholarship, MTN Foundation Scholarship, and others. Check our scholarships page for current opportunities."
    },
    {
      question: "Can I switch to Computer Science from another department?",
      answer: "Inter-departmental transfers are possible but competitive. You'll need to meet the minimum CGPA requirement (usually 3.5+) and pass any required screening tests. Contact the academic office for details."
    },
    {
      question: "What programming languages are taught?",
      answer: "Our curriculum covers Python, Java, C++, JavaScript, and others. The specific languages may vary by course and year of study."
    },
    {
      question: "Are there internship opportunities for students?",
      answer: "Yes, we have partnerships with tech companies that offer internships. Our career services office also helps students find internship placements."
    },
    {
      question: "What facilities are available for Computer Science students?",
      answer: "We have modern computer labs, an innovation hub, high-speed internet, specialized labs for AI, cybersecurity, and more. Students also have access to online learning resources."
    },
    {
      question: "How can I contact the department?",
      answer: "You can visit our office in the SICT building, call +234 801 234 5678, or email cs@futo.edu.ng. Our office hours are 8am-4pm Monday to Friday."
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar />

      <section className={`relative py-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-12">
              Frequently Asked <span className="text-green-400">Questions</span>
            </h1>
            <p className={`text-lg max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
              Find answers to common questions about our programs, admissions, student life, and more.
            </p>
          </div>
        </div>
      </section>

      <section className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  className={`flex items-center justify-between w-full p-6 text-left transition-colors ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`}
                  onClick={() => toggleAccordion(index)}
                >
                  <div className="flex items-center">
                    <FaQuestionCircle className="text-green-500 mr-4 text-xl" />
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                      {faq.question}
                    </h3>
                  </div>
                  {activeIndex === index ? (
                    <FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )}
                </button>
                {activeIndex === index && (
                  <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={`mt-12 p-8 rounded-xl text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Still have questions?
            </h3>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Contact our department office for more information.
            </p>
            <div className="flex justify-center space-x-4">
              <ScrollToTopLink
                to="/contact"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Contact Us
              </ScrollToTopLink>
              <ScrollToTopLink
                to="/admissions"
                className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Admissions Info
              </ScrollToTopLink>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQsPage;
