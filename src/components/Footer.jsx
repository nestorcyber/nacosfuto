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
    <footer className="bg-[#083002] text-white pt-14 pb-8 border-t border-[#138601]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Department Info */}
          <div>
            <div className="flex items-center mb-6">
              <img src={logoDark} alt="FUTO Computer Science Logo" className="h-10 md:h-12 w-auto object-contain" />
            </div>
            <p className="mb-6 text-green-100/70 text-sm leading-relaxed">
              Empowering the next generation of computer scientists through excellence in teaching, innovative research, and tech leadership.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-green-300 hover:bg-[#138601] hover:text-white transition-all">
                <FaFacebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-green-300 hover:bg-[#138601] hover:text-white transition-all">
                <FaTwitter size={16} />
              </a>
              <a href="https://www.instagram.com/nacosfuto?igsh=MTJpcnk3Zzdqcmh6dA==" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-green-300 hover:bg-[#138601] hover:text-white transition-all">
                <FaInstagram size={16} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-green-300 hover:bg-[#138601] hover:text-white transition-all">
                <FaLinkedin size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold mb-4 text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-green-100/80">
              <li><ScrollToTopLink to="/about" className="hover:text-[#4bd043] transition-colors">About Department</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/about/nacos-executives" className="hover:text-[#4bd043] transition-colors">NACOS Executives</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/academics" className="hover:text-[#4bd043] transition-colors">Academic Programs</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/faculty" className="hover:text-[#4bd043] transition-colors">Faculty Directory</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/events" className="hover:text-[#4bd043] transition-colors">Department Events</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/alumni" className="hover:text-[#4bd043] transition-colors">Alumni Network</ScrollToTopLink></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-base font-bold mb-4 text-white uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2.5 text-sm text-green-100/80">
              <li><a href='https://www.futo.edu.ng' target='_blank' rel="noopener noreferrer" className="hover:text-[#4bd043] transition-colors">FUTO Main Portal</a></li>
              <li><ScrollToTopLink to="/resources" className="hover:text-[#4bd043] transition-colors">Academic Resources</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/about/calendar" className="hover:text-[#4bd043] transition-colors">Academic Calendar</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/announcements" className="hover:text-[#4bd043] transition-colors">Official Bulletins</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/faqs" className="hover:text-[#4bd043] transition-colors">Help & FAQs</ScrollToTopLink></li>
              <li><ScrollToTopLink to="/report-emergency" className="hover:text-[#4bd043] transition-colors">Report an Issue</ScrollToTopLink></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base font-bold mb-4 text-white uppercase tracking-wider">Contact Department</h4>
            <div className="space-y-3.5 text-sm text-green-100/80">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-[#138601] flex-shrink-0" />
                <span>Department of Computer Science, FUTO, Owerri, Imo State, Nigeria</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-[#138601] flex-shrink-0" />
                <a href="mailto:csc@futo.edu.ng" className="hover:text-[#4bd043] transition-colors">csc@futo.edu.ng</a>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-[#138601] flex-shrink-0" />
                <a href="tel:+2348012345678" className="hover:text-[#4bd043] transition-colors">+234 801 234 5678</a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-12 pt-6 text-center text-xs text-green-200/50 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>&copy; {new Date().getFullYear()} NACOS FUTO Chapter & Department of Computer Science. All rights reserved.</p>
          <p className="text-green-400/70 font-medium">Towards Advanced Computing & Technological Excellence</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
