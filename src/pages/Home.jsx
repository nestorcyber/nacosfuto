import React, { useEffect, useRef } from "react";
import Navbar from "../components/Nav/Navbar";
import SearchBar from "../components/SearchBar";
import HeroCarousel from "../components/Home/HeroCarousel";
import headerImg from "../assets/header.jpg";
import ScrollToTopLink from "../components/ScrollToTopLink";
import Cards from "../components/Home/Cards";
import Analytics from "../components/Home/Analytics";
import NewsSlider from "../components/Home/NewSlider";
import NacosSection from "../components/Home/NacosSection";
import Footer from "../components/Footer";
import UpskillSection from "../components/Home/UpskillSection";
import DepartmentSlider from "../components/Home/DepartmentSlider";
import UpcomingEvents from "../components/Home/PastEvents";
import UnreadAnnouncementBanner from "../components/UnreadAnnouncementBanner";
import TechTeamSection from "../components/TechTeamSection";
import DepartmentStats from "../components/Home/DepartmentStats";
import QuickHelpCTA from "../components/Home/QuickHelpCTA";

import alumniHomeImg from "../assets/alumni_home.jpg";

const Home = () => {
  const sectionRefs = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "auto"; // force-enable scroll
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -150px 0px",
    };

    const animateOnScroll = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const section = entry.target;
          const delay = section.dataset.delay || "0";

          // Apply different animations based on section index
          const index = sectionRefs.current.indexOf(section);
          const animationClass = getAnimationClass(index);

          section.style.animationDelay = `${delay}ms`;
          section.classList.add(animationClass);
          observer.unobserve(section);
        }
      });
    };

    const observer = new IntersectionObserver(animateOnScroll, observerOptions);

    sectionRefs.current.forEach((ref) => {
      if (ref) {
        // Set staggered delays
        const index = sectionRefs.current.indexOf(ref);
        ref.dataset.delay = index * 100;
        observer.observe(ref);
      }
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const getAnimationClass = (index) => {
    const animations = [
      "animate-fadeInUp",
      "animate-fadeInRight",
      "animate-fadeInLeft",
      "animate-fadeInDown",
      "animate-fadeInUp",
      "animate-fadeInRight",
    ];
    return animations[index % animations.length];
  };

  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
      <Navbar />
      <main className="flex-grow">

        {/* Desktop hero image */}
        <section
          className="relative hidden md:flex h-[85vh] items-center justify-center overflow-hidden bg-gray-900"
          style={{
            backgroundImage: `url(${headerImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* High-tech glassmorphic gradient overlay mesh */}
          <div className="absolute inset-0 bg-gradient-to-tr from-gray-950 via-gray-900/70 to-green-950/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(22,163,74,0.15),transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_40%)]" />

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg tracking-tight leading-tight">
              Empowering the Next Generation of <br />
              <span className="text-green-400">Computer Scientists</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl drop-shadow-md font-medium">
              Join FUTO’s vibrant CS community. Innovate, learn, and lead the future of technology.
            </p>
            <div className="flex gap-4">
              <ScrollToTopLink
                to="/about"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/30"
              >
                Learn More
              </ScrollToTopLink>
              <ScrollToTopLink
                to="/admissions"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg"
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
        <div ref={addToRefs} className="opacity-0">
          <Cards /> {/* Why Choose Computer Science FUTO */}
        </div>
        <div ref={addToRefs} className="opacity-0">
          <DepartmentStats /> {/* Animated Department Stats Counters */}
        </div>
        <div ref={addToRefs} className="opacity-0">
          <UpskillSection /> {/* Upskill — moved up for student priority */}
        </div>
        <div ref={addToRefs} className="opacity-0">
          <UpcomingEvents /> {/* Upcoming Events */}
        </div>
        <div ref={addToRefs} className="opacity-0">
          <Analytics /> {/* Educational Features / Stats */}
        </div>
        <div ref={addToRefs} className="opacity-0">
          <NacosSection /> {/* Nacos Executives (link) — moved lower */}
        </div>
        {/* Alumni Section */}
        <div ref={addToRefs} className="opacity-0">
          <section className="py-24 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Our Alumni</h2>
              <p className="mb-8 text-gray-600 dark:text-gray-400">Join a network of successful graduates making waves in the tech industry.</p>
              {/* Image display */}
              <div className="rounded-xl overflow-hidden shadow-lg h-64 md:h-96 bg-gray-200 dark:bg-gray-700 relative border border-gray-200 dark:border-gray-800">
                <img src={alumniHomeImg} alt="FUTO CSC Alumni Group" className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <ScrollToTopLink to="/about/alumni" className="bg-white text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition">Meet Our Alumni</ScrollToTopLink>
                </div>
              </div>
            </div>
          </section>
        </div>
        {/* Quick Help CTA */}
        <div ref={addToRefs} className="opacity-0">
          <QuickHelpCTA />
        </div>
        {/* Tech Team Section */}
        <div ref={addToRefs} className="opacity-0">
          <TechTeamSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
