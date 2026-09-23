import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Globe, Shield, Heart, PlusCircle, BookOpen } from 'lucide-react';
import { getAppUrls } from '@nacos/config/urls';
import upskillLogo from '../../assets/upskill-full-logo.png';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-600 py-12 px-4 sm:px-6 lg:px-8 mt-auto font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Col 1: Brand & Open Source Mission */}
        <div className="space-y-3">
          <Link to="/" className="inline-block">
            <img 
              src={upskillLogo} 
              alt="NACOS FUTO Upskill Hub" 
              className="h-9 sm:h-10 w-auto object-contain"
            />
          </Link>
          <div className="space-y-1">
            <p className="text-xs font-bold text-[#0056D2] uppercase tracking-wide">
              Open Source Learning Platform
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              A free, community-driven open learning platform available to everyone. Anyone can access cutting-edge tech or request to contribute a course.
            </p>
          </div>
          <div className="text-[11px] text-gray-500 font-medium">
            Federal University of Technology, Owerri
          </div>
        </div>

        {/* Col 2: Learning Tracks */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-[#000000] mb-3">Open Learning Tracks</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/courses?tag=web-dev" className="hover:text-[#0056D2] transition-colors">Frontend & Fullstack React</Link></li>
            <li><Link to="/courses?tag=python" className="hover:text-[#0056D2] transition-colors">Python for AI & Data Science</Link></li>
            <li><Link to="/courses?tag=backend" className="hover:text-[#0056D2] transition-colors">High-Performance Node.js & APIs</Link></li>
            <li><Link to="/courses?tag=ai" className="hover:text-[#0056D2] transition-colors">Machine Learning & Neural Nets</Link></li>
            <li><Link to="/courses" className="hover:text-[#0056D2] font-semibold flex items-center gap-1">Browse All Free Tracks →</Link></li>
          </ul>
        </div>

        {/* Col 3: Academic Gateways */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-[#000000] mb-3">Academic Gateways</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/resources" className="hover:text-[#0056D2] transition-colors">Curriculum Lecture Notes</Link></li>
            <li><Link to="/workshops" className="hover:text-[#0056D2] transition-colors">Live Technical Workshops</Link></li>
            <li><a href={getAppUrls().portal} target="_blank" rel="noreferrer" className="hover:text-[#0056D2] transition-colors">NACOS Student Portal</a></li>
            <li><a href={getAppUrls().website} target="_blank" rel="noreferrer" className="hover:text-[#0056D2] transition-colors">Main Department Website</a></li>
          </ul>
        </div>

        {/* Col 4: Open Contributions */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-[#000000] mb-3">Contribute to Upskill</h4>
          <p className="text-xs text-gray-600 mb-3 leading-relaxed">
            Upskill Hub thrives on community contributions. Anyone can submit a course proposal, author tutorials, or mentor fellow students.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              to="/create-course"
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-[#0056D2] text-white text-xs font-bold hover:bg-[#0043aa] transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Contribute a Course</span>
            </Link>
            <p className="text-[10px] text-gray-500 text-center">
              100% Free · Open to All Students & Creators
            </p>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
        <p>© {new Date().getFullYear()} NACOS FUTO Upskill Hub. Open-source educational initiative.</p>
        <div className="flex items-center gap-4 text-gray-600 font-medium">
          <Link to="/courses" className="hover:text-[#0056D2]">Catalog</Link>
          <Link to="/resources" className="hover:text-[#0056D2]">Resources</Link>
          <Link to="/my-learning" className="hover:text-[#0056D2]">My Learning</Link>
          <Link to="/create-course" className="hover:text-[#0056D2]">Contribute</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
