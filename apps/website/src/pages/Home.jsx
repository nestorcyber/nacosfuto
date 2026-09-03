import React, { useEffect } from "react";
import Navbar from "../components/Nav/Navbar";
import HeroCarousel from "../components/Home/HeroCarousel";
import headerImg from "../assets/header.jpg";
import ScrollToTopLink from "../components/ScrollToTopLink";
import DepartmentStats from "../components/Home/DepartmentStats";
import Cards from "../components/Home/Cards";
import Analytics from "../components/Home/Analytics";
import UpskillSection from "../components/Home/UpskillSection";
import UpcomingEvents from "../components/Home/PastEvents";
import NacosSection from "../components/Home/NacosSection";
import QuickHelpCTA from "../components/Home/QuickHelpCTA";
import TechTeamSection from "../components/TechTeamSection";
import Footer from "../components/Footer";

import alumniHomeImg from "../assets/alumni_home.jpg";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "auto";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#041801] text-[#083002] dark:text-white transition-colors duration-200">
      <Navbar />
      
      <main className="flex-grow">
        {/* Desktop hero image */}
        <section
          className="relative hidden md:flex h-[80vh] min-h-[540px] items-center justify-center overflow-hidden bg-gray-900"
          style={{
            backgroundImage: `url(${headerImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* High-tech gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#041801] via-[#083002]/80 to-[#138601]/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(19,134,1,0.25),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(75,208,67,0.18),transparent_40%)]" />

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-lg tracking-tight leading-[1.15]">
              Empowering the Next Generation of <br />
              <span className="text-[#4bd043]">Computer Scientists</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-8 max-w-2xl drop-shadow-md font-normal leading-relaxed">
              Join FUTO's vibrant CS community. Innovate, learn, and lead the future of global computing technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <ScrollToTopLink
                to="/about"
                className="inline-flex items-center justify-center px-7 py-2.5 bg-[#138601] hover:bg-[#0f6c01] text-white font-semibold text-sm rounded shadow-sm transition-colors cursor-pointer min-h-[42px]"
              >
                Learn More
              </ScrollToTopLink>
              <ScrollToTopLink
                to="/admissions"
                className="inline-flex items-center justify-center px-7 py-2.5 bg-transparent border border-white hover:bg-white hover:text-[#083002] text-white font-semibold text-sm rounded transition-colors cursor-pointer min-h-[42px]"
              >
                Admissions
              </ScrollToTopLink>
            </div>
          </div>
        </section>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <HeroCarousel />
        </div>

        {/* 1. Department at a Glance */}
        <DepartmentStats />

        {/* 2. Quick Access Cards */}
        <Cards />

        {/* 3. Upskill Section */}
        <UpskillSection />

        {/* 4. Upcoming Events */}
        <UpcomingEvents />

        {/* 5. Educational Framework & Analytics */}
        <Analytics />

        {/* 6. NACOS Section */}
        <NacosSection />

        {/* 7. Alumni Section */}
        <section className="py-20 bg-[#f2fbf1] dark:bg-[#083002] text-[#083002] dark:text-white transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-[#083002] dark:text-white">Our Alumni Network</h2>
            <p className="mb-10 text-[#083002]/80 dark:text-green-100/80 max-w-xl mx-auto text-base leading-relaxed">Join a network of successful graduates making waves across top global tech companies.</p>
            <div className="rounded-2xl overflow-hidden shadow-lg h-64 md:h-96 bg-gray-200 dark:bg-gray-700 relative border border-[#138601]/20 dark:border-[#138601]/30 group">
              <img src={alumniHomeImg} alt="FUTO CSC Alumni Group" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <ScrollToTopLink to="/about/alumni" className="inline-flex items-center justify-center px-7 py-2.5 bg-white text-[#083002] hover:bg-[#f1f3f5] font-semibold text-sm rounded shadow-md transition-colors cursor-pointer min-h-[42px]">
                  Meet Our Alumni
                </ScrollToTopLink>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Quick Help CTA */}
        <QuickHelpCTA />

        {/* 9. Tech Team Section */}
        <TechTeamSection />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
