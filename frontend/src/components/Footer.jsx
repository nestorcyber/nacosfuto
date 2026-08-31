import React from 'react';
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaInstagram
} from 'react-icons/fa';
import logoDark from '../assets/full-logo-dark.png';
import ScrollToTopLink from './ScrollToTopLink';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Department Info */}
          <div>
            <div className="flex items-center mb-6">
              <img src={logoDark} alt="FUTO Computer Science Logo" className="h-10 md:h-12 w-auto object-contain" />
            </div>
            <p className="mb-4 text-gray-400">
              Empowering the next generation of computer scientists through quality education and research.
            </p>
            <div className="flex space-x-4">
              <ScrollToTopLink to="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <FaFacebook size={20} />
              </ScrollToTopLink>
              <ScrollToTopLink to="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <FaTwitter size={20} />
              </ScrollToTopLink>
              <ScrollToTopLink to="https://www.instagram.com/nacosfuto?igsh=MTJpcnk3Zzdqcmh6dA==" className="text-gray-400 hover:text-green-500 transition-colors">
                <FaInstagram size={20} />
              </ScrollToTopLink>
              <ScrollToTopLink to="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <FaYoutube size={20} />
              </ScrollToTopLink>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><ScrollToTopLink to="/about" className="footer-link" >About Department</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/academics" className="footer-link">Academics</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/research" className="footer-link">Research</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/students" className="footer-link">Student Life</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/alumni" className="footer-link">Alumni</ScrollToTopLink></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-2">
              <li><a href='https://www.futo.edu.ng' target='_blank' className="footer-link">FUTO Website</a> </li>
              <li><ScrollToTopLink to="/gpa-calculator" className="footer-link">GPA Calculator</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/courses" className="footer-link">Lecture Materials</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/timetable" className="footer-link">Academic Timetable</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/faqs" className="footer-link">FAQs</ScrollToTopLink></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-2 text-green-500" />
                <p className="text-gray-400">
                  Department of Computer Science, FUTO, Owerri, Imo State, Nigeria
                </p>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="mr-2 text-green-500" />
                <ScrollToTopLink to="mailto:cs@futo.edu.ng" className="footer-link">csc@futo.edu.ng</ScrollToTopLink>
              </div>
              <div className="flex items-center">
                <FaPhone className="mr-2 text-green-500" />
                <ScrollToTopLink to="tel:+2348012345678" className="footer-link">+234 801 234 5678</ScrollToTopLink>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500">
          <p>&copy; 2025 - 2026 FUTO Computer Science Department. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;