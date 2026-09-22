import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Github, Globe, Shield, Heart } from 'lucide-react';
import { getAppUrls } from '@nacos/config/urls';

const Footer = () => {
  return (
    <footer className="bg-[#020e00] border-t border-[#138601]/25 text-gray-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Col 1: Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#138601] flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="text-base font-black text-white">NACOS UPSKILL HUB</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            The premier continuous learning, curriculum mastery, and developer workshop ecosystem by NACOS FUTO.
          </p>
          <div className="text-[11px] text-green-200/60 font-mono">
            Federal University of Technology, Owerri
          </div>
        </div>

        {/* Col 2: Learning Tracks */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Learning Tracks</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/courses?tag=web-dev" className="hover:text-[#4bd043] transition-colors">Frontend & Fullstack React</Link></li>
            <li><Link to="/courses?tag=python" className="hover:text-[#4bd043] transition-colors">Python for AI & Data Science</Link></li>
            <li><Link to="/courses?tag=backend" className="hover:text-[#4bd043] transition-colors">High-Performance Node.js & APIs</Link></li>
            <li><Link to="/courses?tag=ai" className="hover:text-[#4bd043] transition-colors">Machine Learning & Neural Nets</Link></li>
          </ul>
        </div>

        {/* Col 3: Gateways & Portals */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Academic Gateways</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/resources" className="hover:text-[#4bd043] transition-colors">Curriculum Lecture Notes</Link></li>
            <li><Link to="/workshops" className="hover:text-[#4bd043] transition-colors">Live Technical Workshops</Link></li>
            <li><a href={getAppUrls().portal} target="_blank" rel="noreferrer" className="hover:text-[#4bd043] transition-colors">NACOS Student Portal</a></li>
            <li><a href={getAppUrls().website} target="_blank" rel="noreferrer" className="hover:text-[#4bd043] transition-colors">Main Department Website</a></li>
          </ul>
        </div>

        {/* Col 4: Creator & Community */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Teach on Upskill</h4>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">
            Are you a senior student, alumni or tech lead? Share your knowledge and create video courses with AI assistance.
          </p>
          <Link
            to="/create-course"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#138601]/20 border border-[#138601]/40 text-[#4bd043] text-xs font-semibold hover:bg-[#138601] hover:text-white transition-colors"
          >
            Launch Creator Studio
          </Link>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-[#138601]/15 flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
        <p>© {new Date().getFullYear()} NACOS FUTO. All rights reserved.</p>
        <div className="flex items-center gap-4 text-gray-400">
          <Link to="/courses" className="hover:text-white">Catalog</Link>
          <Link to="/resources" className="hover:text-white">Resources</Link>
          <Link to="/my-learning" className="hover:text-white">My Learning</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
