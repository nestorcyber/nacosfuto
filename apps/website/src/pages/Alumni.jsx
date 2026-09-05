import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Nav/Navbar";
import Footer from "../components/Footer";
import {
  FiUsers,
  FiAward,
  FiBriefcase,
  FiGlobe,
  FiLinkedin,
} from "react-icons/fi";
import { FaGraduationCap, FaAward, FaBuilding, FaGlobeAmericas, FaLinkedin, FaUserGraduate } from "react-icons/fa";
import ScrollToTopLink from "../components/ScrollToTopLink";
import { getCloudinaryAssetUrl } from "@nacos/media";
import alumniImage from "../assets/alumni.jpg";
import benitaImg from "../assets/alumni_benita.jpg";
import godfirstImg from "../assets/alumni_godfirst.jpg";

const Alumni = () => {
  const alumniHeroImg = getCloudinaryAssetUrl('alumni') || alumniImage;
  const alumniStats = [
    {
      value: "5,000+",
      label: "Graduates Worldwide",
      icon: <FaGraduationCap className="text-[#138601] dark:text-[#4bd043] text-2xl mx-auto" />,
    },
    {
      value: "20+",
      label: "Countries Represented",
      icon: <FaGlobeAmericas className="text-[#138601] dark:text-[#4bd043] text-2xl mx-auto" />,
    },
    {
      value: "100+",
      label: "Tech Companies Founded",
      icon: <FaBuilding className="text-[#138601] dark:text-[#4bd043] text-2xl mx-auto" />,
    },
    {
      value: "50+",
      label: "Industry Leadership Awards",
      icon: <FaAward className="text-[#138601] dark:text-[#4bd043] text-2xl mx-auto" />,
    },
  ];

  const notableAlumni = [
    {
      name: "Godfirst Asogwa",
      gradYear: "Alumnus",
      position: "Lead Software Engineer @ Sudo Africa",
      achievement: "Fintech infrastructure specialist building modern digital card payment systems across Africa",
      linkedin: "https://www.linkedin.com/in/godfirst-asogwa/",
      image: getCloudinaryAssetUrl('alumni_godfirst', { preset: 'card' }) || godfirstImg
    },
    {
      name: "Benita Nwabueze",
      gradYear: "Alumna",
      position: "Senior Cybersecurity Analyst @ FirstBank",
      achievement: "Securing modern enterprise infrastructure, banking compliance, and digital banking assets",
      linkedin: "https://www.linkedin.com/in/nwabueze-benita/",
      image: getCloudinaryAssetUrl('alumni_benita', { preset: 'card' }) || benitaImg
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#041801] text-[#083002] dark:text-white transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 bg-white dark:bg-[#041801] border-b border-[#138601]/20 dark:border-[#138601]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded bg-[#f2fbf1] dark:bg-[#083002] border border-[#138601]/30 text-[#138601] dark:text-[#4bd043] text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
                GLOBAL COMMUNITY
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#083002] dark:text-white tracking-tight leading-tight">
                FUTO CSC <span className="text-[#138601] dark:text-[#4bd043]">Alumni Network</span>
              </h1>
              <p className="text-base sm:text-lg text-[#083002]/75 dark:text-green-100/75 mb-8 leading-relaxed">
                Connecting generations of computer scientists who are shaping the future of technology, fintech, artificial intelligence, and cybersecurity in Nigeria and across the globe.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <ScrollToTopLink
                  to="/contact"
                  className="inline-flex items-center justify-center px-7 py-2.5 bg-[#138601] hover:bg-[#0f6c01] text-white font-semibold text-sm rounded shadow-sm transition-colors cursor-pointer min-h-[42px]"
                >
                  Join Alumni Network
                </ScrollToTopLink>
                <ScrollToTopLink
                  to="/events"
                  className="inline-flex items-center justify-center px-7 py-2.5 font-medium text-sm text-gray-900 dark:text-white bg-[#f1f3f5] dark:bg-[#083002] hover:bg-[#e9ecef] dark:hover:bg-[#138601] rounded border border-gray-200 dark:border-[#138601]/30 transition-colors cursor-pointer min-h-[42px]"
                >
                  Upcoming Events
                </ScrollToTopLink>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-[#138601]/20 dark:border-[#138601]/30">
              <img
                src={alumniHeroImg}
                alt="FUTO Computer Science Alumni"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Alumni Impact */}
      <section className="py-20 bg-[#f4faf3] dark:bg-[#041801] border-b border-[#138601]/20 dark:border-[#138601]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#083002] dark:text-white tracking-tight mb-3">
              Alumni <span className="text-[#138601] dark:text-[#4bd043]">Impact</span>
            </h2>
            <p className="text-base text-[#083002]/70 dark:text-green-100/70 max-w-xl mx-auto leading-relaxed">
              Global contributions by our alumni network across tech hubs worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {alumniStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#083002] p-6 rounded-2xl text-center shadow-sm hover:shadow-xl hover:border-[#138601] dark:hover:border-[#4bd043] border border-[#138601]/20 dark:border-[#138601]/30 border-b-4 border-b-[#138601] transform hover:-translate-y-1.5 transition-all duration-300"
              >
                {stat.icon}
                <h4 className="text-3xl font-extrabold text-[#138601] dark:text-[#4bd043] mt-3 mb-1">
                  {stat.value}
                </h4>
                <p className="text-xs font-semibold text-[#083002]/80 dark:text-green-200/80 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notable Alumni */}
      <section className="py-20 bg-white dark:bg-[#041801] border-b border-[#138601]/20 dark:border-[#138601]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#083002] dark:text-white tracking-tight mb-3">
              Distinguished <span className="text-[#138601] dark:text-[#4bd043]">Alumni Spotlight</span>
            </h2>
            <p className="text-base text-[#083002]/70 dark:text-green-100/70 max-w-xl mx-auto leading-relaxed">
              Spotlighting our extraordinary graduates excelling across major global industries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {notableAlumni.map((alum, index) => (
              <div
                key={index}
                className="group w-full max-w-[320px] flex flex-col bg-white dark:bg-[#083002] p-5 rounded-2xl border border-[#138601]/30 shadow-sm hover:shadow-xl hover:border-[#138601] dark:hover:border-[#4bd043] transition-all duration-300 transform hover:-translate-y-1.5"
              >
                {/* Square Bounding Box for Image */}
                <div className="w-full aspect-square overflow-hidden rounded-xl border border-gray-200 dark:border-[#138601]/20 bg-gray-100 dark:bg-[#041801] flex items-center justify-center relative">
                  {alum.image ? (
                    <img 
                      src={alum.image} 
                      alt={alum.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[#138601] dark:text-[#4bd043] p-4">
                      <FaUserGraduate className="text-6xl opacity-60 mb-2" />
                    </div>
                  )}
                </div>

                {/* Divider Line */}
                <div className="border-t my-4 border-gray-200 dark:border-[#138601]/20"></div>

                {/* Details Section */}
                <div className="flex flex-col flex-grow text-center items-center">
                  <h3 className="font-bold text-lg tracking-tight text-[#083002] dark:text-white uppercase line-clamp-1">
                    {alum.name}
                  </h3>

                  <p className="text-xs font-bold uppercase tracking-wider text-[#138601] dark:text-[#4bd043] mt-1 mb-2">
                    {alum.position}
                  </p>

                  <p className="text-xs text-[#083002]/75 dark:text-green-100/75 leading-relaxed italic line-clamp-2 mb-4">
                    {alum.achievement}
                  </p>

                  {/* Social Handle Button */}
                  {alum.linkedin && (
                    <div className="pt-3 border-t w-full border-gray-150 dark:border-[#138601]/20 mt-auto flex justify-center">
                      <a
                        href={alum.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#138601] hover:bg-[#0f6c01] text-white font-semibold text-xs transition-colors shadow-sm"
                        title={`Connect with ${alum.name} on LinkedIn`}
                      >
                        <FaLinkedin className="text-sm" /> LinkedIn
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits and Giving Back */}
      <section className="py-20 bg-[#f4faf3] dark:bg-[#041801]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white dark:bg-[#083002] p-8 rounded-2xl shadow-sm border border-[#138601]/20 dark:border-[#138601]/30">
              <h3 className="text-2xl font-bold text-[#083002] dark:text-white mb-4">
                Alumni Community Benefits
              </h3>
              <ul className="space-y-4 text-sm text-[#083002]/80 dark:text-green-100/80">
                <li className="flex items-start">
                  <span className="text-[#138601] dark:text-[#4bd043] mr-3 font-bold">•</span>
                  <span>Exclusive networking events, industry panels, and homecoming reunions.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#138601] dark:text-[#4bd043] mr-3 font-bold">•</span>
                  <span>Talent recruitment access for top student software engineers.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#138601] dark:text-[#4bd043] mr-3 font-bold">•</span>
                  <span>Continued access to department research papers and journal archives.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#138601] dark:text-[#4bd043] mr-3 font-bold">•</span>
                  <span>Mentorship opportunities to guide current undergraduate developers.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-[#083002] p-8 rounded-2xl shadow-sm border border-[#138601]/20 dark:border-[#138601]/30">
              <h3 className="text-2xl font-bold text-[#083002] dark:text-white mb-4">
                Give Back to FUTO CSC
              </h3>
              <p className="text-xs text-[#083002]/75 dark:text-green-100/75 mb-6">
                Support the next generation through structured departmental initiatives:
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-[#138601] pl-4">
                  <h4 className="font-bold text-sm text-[#083002] dark:text-white">Student Scholarships & Awards</h4>
                  <p className="text-xs text-[#083002]/70 dark:text-green-100/70 mt-0.5">Fund tuition and laptop grants for high-performing students.</p>
                </div>
                <div className="border-l-4 border-[#138601] pl-4">
                  <h4 className="font-bold text-sm text-[#083002] dark:text-white">Guest Lectures & Masterclasses</h4>
                  <p className="text-xs text-[#083002]/70 dark:text-green-100/70 mt-0.5">Share practical industry expertise on modern cloud, DevOps, and AI.</p>
                </div>
                <div className="border-l-4 border-[#138601] pl-4">
                  <h4 className="font-bold text-sm text-[#083002] dark:text-white">Internships & Job Opportunities</h4>
                  <p className="text-xs text-[#083002]/70 dark:text-green-100/70 mt-0.5">Recruit FUTO Computer Science talent for remote and on-site roles.</p>
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

export default Alumni;