import React from "react";
import { 
  FiBookOpen, 
  FiAward, 
  FiCode, 
  FiCheckCircle 
} from "react-icons/fi";
import { FaGraduationCap, FaLaptopCode, FaTrophy, FaChalkboardTeacher } from "react-icons/fa";
import studentGroupImg from "../../assets/gallery_student_group.jpg";
import ScrollToTopLink from "../ScrollToTopLink";

const offerings = {
  left: [
    {
      icon: <FaChalkboardTeacher className="text-xl" />,
      title: "Seminars / Bootcamps",
      description:
        "We organize immersive hands-on workshops, bootcamps, and masterclasses covering both foundational principles and modern tech stacks.",
      badge: "Industry Led"
    },
    {
      icon: <FaTrophy className="text-xl" />,
      title: "Hackathons & Challenges",
      description:
        "We host thrilling coding challenges, algorithmic contests, and project hackathons with high-value prizes and venture mentorship.",
      badge: "Competitions"
    }
  ],
  right: [
    {
      icon: <FaLaptopCode className="text-xl" />,
      title: "Computing Education",
      description:
        "We provide curated learning roadmaps in Full-Stack Engineering, AI & Automation, Cybersecurity, Cloud Systems, and Data Science.",
      badge: "Practical Skills"
    },
    {
      icon: <FaGraduationCap className="text-xl" />,
      title: "Scholarships & Grants",
      description:
        "We facilitate tuition grants, professional exam sponsorships, dev tooling access, and conference sponsorships for computing students.",
      badge: "Student Support"
    }
  ]
};

const FeatureCard = ({ icon, title, description, badge, align = "left" }) => {
  return (
    <div className="group relative p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#083002] border border-[#138601]/15 dark:border-[#138601]/30 shadow-sm hover:shadow-xl hover:border-[#138601]/50 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#138601] text-white flex items-center justify-center shadow-md shadow-[#138601]/30 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#f2fbf1] dark:bg-[#041801] text-[#138601] dark:text-[#4bd043] border border-[#138601]/20">
            {badge}
          </span>
        </div>

        <h3 className="text-xl font-bold text-[#083002] dark:text-white mb-2 group-hover:text-[#138601] dark:group-hover:text-[#4bd043] transition-colors">
          {title}
        </h3>

        <p className="text-sm text-[#083002]/75 dark:text-green-100/75 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[#138601]/10 dark:border-white/10 flex items-center text-xs font-semibold text-[#138601] dark:text-[#4bd043]">
        <FiCheckCircle className="mr-1.5" />
        <span>Active Program</span>
      </div>
    </div>
  );
};

const WhatWeOffer = () => {
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-[#041801] transition-colors duration-300 relative overflow-hidden">
      {/* Subtle ambient light accents */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-[#138601]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#138601]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2fbf1] dark:bg-[#083002] border border-[#138601]/30 text-[#138601] dark:text-[#4bd043] text-xs font-extrabold uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-[#138601] animate-pulse" />
            WHAT WE OFFER
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#083002] dark:text-white tracking-tight leading-tight mb-4">
            We Help Computing Students to <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#138601] via-[#3db92c] to-[#138601] bg-clip-text text-transparent">
              Grow Exponentially
            </span>
          </h2>

          {/* Accent decorative bar */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-1 rounded-full bg-[#138601]" />
            <div className="w-3 h-1 rounded-full bg-[#4bd043]" />
          </div>

          <p className="text-base sm:text-lg text-[#083002]/70 dark:text-green-100/70 leading-relaxed">
            Bridging academia and the modern tech ecosystem through high-impact initiatives, student empowerment, and world-class opportunities.
          </p>
        </div>

        {/* 3-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column - 2 Cards (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {offerings.left.map((item, idx) => (
              <FeatureCard key={idx} {...item} align="left" />
            ))}
          </div>

          {/* Center Column - Featured Visual (4 cols) */}
          <div className="lg:col-span-4 relative group">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#138601]/30 dark:border-[#138601]/40 bg-[#083002] aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] transform group-hover:scale-[1.02] transition-transform duration-500">
              <img
                src={studentGroupImg}
                alt="FUTO NACOS Computing Students"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#083002]/90 via-[#083002]/20 to-transparent" />

              {/* Floating Bottom Card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/90 dark:bg-[#083002]/90 backdrop-blur-md border border-[#138601]/30 text-center shadow-lg">
                <p className="text-xs font-bold uppercase tracking-wider text-[#138601] dark:text-[#4bd043] mb-1">
                  Community & Innovation
                </p>
                <h4 className="text-sm sm:text-base font-extrabold text-[#083002] dark:text-white">
                  Over 5,000+ Future Tech Leaders
                </h4>
                <div className="mt-2.5">
                  <ScrollToTopLink
                    to="/about"
                    className="inline-block text-xs font-bold text-white bg-[#138601] hover:bg-[#0f6c01] px-4 py-1.5 rounded-lg transition-colors shadow-sm"
                  >
                    Explore Community &rarr;
                  </ScrollToTopLink>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - 2 Cards (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {offerings.right.map((item, idx) => (
              <FeatureCard key={idx} {...item} align="right" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeOffer;
