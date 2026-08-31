import React, { useEffect, useRef, useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane } from "react-icons/fa";
import { gsap } from "gsap";
import ScrollToTopLink from "../components/ScrollToTopLink";
import contactImage from "../assets/contact.jpg";
import Footer from "../components/Footer";
import Navbar from "../components/Nav/Navbar";

const Contact = () => {
  const titleRefs = useRef([]);
  titleRefs.current = [];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="text-green-500 text-xl" />,
      title: "Address",
      info: "Department of Computer Science, FUTO, Owerri, Imo State, Nigeria"
    },
    {
      icon: <FaPhone className="text-green-500 text-xl" />,
      title: "Phone",
      info: "+234 801 234 5678"
    },
    {
      icon: <FaEnvelope className="text-green-500 text-xl" />,
      title: "Email",
      info: "cs@futo.edu.ng"
    },
    {
      icon: <FaClock className="text-green-500 text-xl" />,
      title: "Office Hours",
      info: "Monday - Friday: 8:00 AM - 4:00 PM"
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
                Contact <span className="text-green-400">Us</span>
              </h1>
              <p className="text-lg text-gray-800 dark:text-gray-300 mb-8">
                Have questions or need more information? Reach out to our department
                through any of the channels below or send us a message directly.
              </p>
              <div className="flex space-x-4">
                <ScrollToTopLink
                  to="/faqs"
                  className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Visit FAQs
                </ScrollToTopLink>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img
                src={contactImage}
                alt="FUTO Computer Science Department"
                className="w-full h-auto object-cover"
              />
            </div>
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
                Send Us a <span className="text-green-400">Message</span>
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <FaPaperPlane className="mr-2" />
                  Send Message
                </button>
              </form>
            </div>
            <div>
              <h2
                ref={addToRefs}
                className="text-3xl font-bold text-gray-800 dark:text-white mb-6"
              >
                Contact <span className="text-green-400">Information</span>
              </h2>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mt-1 mr-4">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {item.info}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 bg-gray-100 dark:bg-gray-700 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                  Department Office Location
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Our office is located in the School of Information and Communication Technology (SICT) building, 
                  first floor, room 102.
                </p>
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
                  {/* Map placeholder - replace with actual map component */}
                  <div className="w-full h-64 flex items-center justify-center text-gray-500">
                    <span>Map will be displayed here</span>
                  </div>
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

export default Contact;