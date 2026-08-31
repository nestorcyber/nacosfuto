import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaUserTie } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import ScrollToTopLink from '../ScrollToTopLink';
import presidentImg from '../../assets/executives/president_irechukwu.jpg';
import vpImg from '../../assets/executives/vp_chinaemerem.jpg';
import secGenImg from '../../assets/executives/sec_gen_makuochukwu.jpg';
import asgImg from '../../assets/executives/asg_chinecherem.jpg';
import danielImg from '../../assets/executives/daniel_chukwuka.jpg';
import treasurerImg from '../../assets/executives/treasurer_chikamso.jpg';
import proImg from '../../assets/executives/pro_john.jpg';
import welfareImg from '../../assets/executives/welfare_onyoiza.jpg';
import ictImg from '../../assets/executives/ict_dir_ifeanyi.jpg';
import ictAsstImg from '../../assets/executives/ict_asst_victory.jpg';
import socialsImg from '../../assets/executives/socials_dir_munachimso.jpg';
import sportsImg from '../../assets/executives/sports_dir_ifeanyi.jpg';
import provost1Img from '../../assets/executives/provost1_rosemary.jpg';
import provost2Img from '../../assets/executives/provost2_chidera.jpg';


const NacosSection = () => {
  const executives = [
    { name: "High Comrade Irechukwu Emmanuel S.", position: "President", image: presidentImg },
    { name: "Comrade Okolie Chinaemereme E.", position: "Vice President", image: vpImg },
    { name: "High Comrade Egwuonwu Makuochukwu V.", position: "Secretary General", image: secGenImg },
    { name: "Comrade Jibulu Chinecherem Favour", position: "Ass. Secretary General", image: asgImg },
    { name: "Comrade Nzeh Daniel Chukwuka", position: "Financial Secretary", image: danielImg },
    { name: "Comrade Pedro Dennis Chikamso", position: "Treasurer", image: treasurerImg },
    { name: "Journalist Comrade Balogun John M.", position: "P.R.O", image: proImg },
    { name: "Comrade Jonathan Faith Onyoiza", position: "Director of Welfare", image: welfareImg },
    { name: "Comrade Anyanwu Nestor Ifeanyi", position: "Director of ICT", image: ictImg },
    { name: "Comrade Okere Kelechukwu Victory", position: "Asst. Director of ICT", image: ictAsstImg },
    { name: "Comrade Ikenna Elvis Munachimso", position: "Director of Socials", image: socialsImg },
    { name: "Comrade Azubuike Ebenezer Ifeanyi", position: "Director of Sports", image: sportsImg },
    { name: "Comrade Emeka Mmesoma Rosemary", position: "Provost 1", image: provost1Img },
    { name: "Comrade Nduka Anselem Chidera", position: "Provost 2", image: provost2Img },
  ];

  // Carousel Items structure mapping
  const items = executives.map((exec, idx) => ({
    id: idx,
    title: exec.name,
    subtitle: exec.position,
    image: exec.image,
    link: "/about/nacos-executives",
    accentColor: "#10b981", // Green theme accent
    badge: exec.position === "President" ? "President" : undefined
  }));

  const autoplaySpeed = 0.0028; // Idle scrolling speed

  // Carousel state
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const targetPosition = useRef(null);
  const animationFrameRef = useRef(null);
  const dragDistance = useRef(0);

  // Client viewport detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate active index based on center proximity
  const activeIndex = Math.round(scrollPosition + items.length * 4) % items.length;
  const activeItem = items[activeIndex];

  // Next and Prev handlers
  const handleNext = useCallback(() => {
    const currentTarget = targetPosition.current !== null ? targetPosition.current : scrollPosition;
    targetPosition.current = Math.round(currentTarget + 1);
  }, [scrollPosition]);

  const handlePrev = useCallback(() => {
    const currentTarget = targetPosition.current !== null ? targetPosition.current : scrollPosition;
    targetPosition.current = Math.round(currentTarget - 1);
  }, [scrollPosition]);

  // Click card to center it
  const handleCardClick = (index, dist, e) => {
    if (isDragging.current || dragDistance.current > 5) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (Math.abs(dist) < 0.2) return; // Click link inside card if centered

    e.preventDefault();
    e.stopPropagation();
    targetPosition.current = scrollPosition + dist;
  };

  // Continuous animation frame loop
  useEffect(() => {
    const updatePhysics = () => {
      if (isDragging.current) {
        animationFrameRef.current = requestAnimationFrame(updatePhysics);
        return;
      }

      if (targetPosition.current !== null) {
        // Glide to target card
        const diff = targetPosition.current - scrollPosition;
        if (Math.abs(diff) < 0.005) {
          setScrollPosition((targetPosition.current + items.length * 4) % items.length);
          targetPosition.current = null;
        } else {
          setScrollPosition((prev) => (prev + diff * 0.08 + items.length * 4) % items.length);
        }
      } else if (!isHovered) {
        // Auto-glide
        setScrollPosition((prev) => (prev + autoplaySpeed + items.length * 4) % items.length);
      }

      animationFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animationFrameRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [scrollPosition, isHovered, items.length, autoplaySpeed]);

  // Drag handlers
  const handleDragStart = (e) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    isDragging.current = true;
    startX.current = e.clientX;
    startScroll.current = scrollPosition;
    dragDistance.current = 0;
    targetPosition.current = null;

    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handleDragMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startX.current;
    dragDistance.current = Math.abs(dx);

    const dragSpacing = isMobile ? 200 : isTablet ? 260 : 340;
    const dragOffset = -dx / dragSpacing;

    let newScroll = (startScroll.current + dragOffset + items.length * 4) % items.length;
    setScrollPosition(newScroll);
  };

  const handleDragEnd = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (containerRef.current) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }

    const nearestIndex = Math.round(scrollPosition);
    let target = nearestIndex;
    let diff = target - scrollPosition;
    if (diff > items.length / 2) target -= items.length;
    if (diff < -items.length / 2) target += items.length;

    targetPosition.current = target;
    setTimeout(() => {
      dragDistance.current = 0;
    }, 50);
  };

  // Layout sizing parameters - optimized for wider full-width display
  const minWidth = isMobile ? 150 : isTablet ? 210 : 260;
  const maxWidth = isMobile ? 220 : isTablet ? 290 : 360;
  const gap = isMobile ? 12 : isTablet ? 18 : 24;

  // Visible items projection
  const visibleItems = items
    .map((item, index) => {
      let dist = index - scrollPosition;
      const half = items.length / 2;
      if (dist > half) dist -= items.length;
      if (dist < -half) dist += items.length;
      return { item, index, dist, absDist: Math.abs(dist) };
    })
    .filter((d) => d.absDist < 2.0)
    .sort((a, b) => a.dist - b.dist);

  let activeSortedIndex = 0;
  let minAbsDist = Infinity;
  visibleItems.forEach((d, idx) => {
    if (d.absDist < minAbsDist) {
      minAbsDist = d.absDist;
      activeSortedIndex = idx;
    }
  });

  const widths = visibleItems.map((d) => {
    return maxWidth - Math.min(d.absDist, 1.0) * (maxWidth - minWidth);
  });

  const offsets = new Array(visibleItems.length).fill(0);
  if (visibleItems.length > 0) {
    const activeItemData = visibleItems[activeSortedIndex];
    const activeWidth = widths[activeSortedIndex];
    offsets[activeSortedIndex] = activeItemData.dist * (activeWidth + gap);

    for (let j = activeSortedIndex + 1; j < visibleItems.length; j++) {
      offsets[j] = offsets[j - 1] + widths[j - 1] / 2 + gap + widths[j] / 2;
    }

    for (let j = activeSortedIndex - 1; j >= 0; j--) {
      offsets[j] = offsets[j + 1] - widths[j] / 2 - gap - widths[j + 1] / 2;
    }
  }

  return (
    <section className="py-24 bg-green-900 dark:bg-green-955 text-white overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Centered Introduction Header (Prevents blocking or overlapping with carousel) */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 text-white">
            <span className="text-green-300">NACOS</span> Student Association
          </h2>
          <p className="text-green-100 text-sm md:text-base leading-relaxed mb-8">
            The Nigerian Association of Computing Students (NACOS) is the premier umbrella body for all student software developers, cybersecurity analysts, network engineers, and data scientists within our department.
          </p>
          <div className="flex justify-center">
            <ScrollToTopLink to="/about/nacos-executives" className="inline-block px-8 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-green-500/20 hover:scale-105">
              Meet the Executives
            </ScrollToTopLink>
          </div>
        </div>

        {/* Full-width Carousel Area */}
        <div className="flex flex-col items-center w-full mt-10">

          {/* Carousel Stage Track */}
          <div
            ref={containerRef}
            onPointerDown={handleDragStart}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
            onPointerCancel={handleDragEnd}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative w-full h-[320px] sm:h-[400px] md:h-[450px] overflow-visible cursor-grab active:cursor-grabbing select-none flex justify-center items-center"
          >
            {visibleItems.map((data, idx) => {
              const { item, dist, absDist } = data;
              const cardWidth = widths[idx];
              const offsetX = offsets[idx];

              const opacity = 1.0 - Math.min(absDist, 1.2) * 0.55;
              const blurVal = Math.min(absDist, 1.2) * 0.8;
              const isActive = absDist < 0.5;

              return (
                <div
                  key={item.id}
                  onClick={(e) => handleCardClick(data.index, dist, e)}
                  style={{
                    width: `${cardWidth}px`,
                    transform: `translate3d(calc(-50% + ${offsetX}px), -50%, 0)`,
                    opacity: opacity,
                    filter: `blur(${blurVal}px)`,
                    zIndex: isActive ? 30 : 20,
                  }}
                  className="absolute left-1/2 top-1/2 h-[260px] sm:h-[340px] md:h-[390px] rounded-[2rem] overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-2xl transition-shadow duration-[600ms] group pointer-events-auto"
                >
                  {/* Background image */}
                  <div className="absolute inset-0 w-full h-full pointer-events-none">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                  </div>

                  {/* Accented Badge for President */}
                  {item.badge && isActive && (
                    <div className="absolute top-6 left-6 z-10">
                      <span
                        className="text-[9px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full text-white backdrop-blur-md shadow-sm border border-white/10"
                        style={{ backgroundColor: `${item.accentColor}cc` }}
                      >
                        {item.badge}
                      </span>
                    </div>
                  )}

                  {/* Active Card Bottom Details Overlay */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10 flex flex-col justify-end transition-all duration-[600ms] ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                      }`}
                  >
                    <div className="space-y-2 max-w-sm text-left">
                      <h4 className="text-lg md:text-2xl font-black text-white tracking-tight leading-tight uppercase">
                        {item.title}
                      </h4>
                      <p className="text-white/70 text-xs md:text-sm font-semibold">
                        {item.subtitle}
                      </p>
                      {item.link && isActive && (
                        <div className="pt-4">
                          <ScrollToTopLink
                            to={item.link}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md hover:shadow-green-500/30"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Explore Bio
                            <FiArrowRight className="text-xs" />
                          </ScrollToTopLink>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Slide Navigation Dots */}
          <div className="flex gap-2 mt-8">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  let target = i;
                  let diff = target - scrollPosition;
                  if (diff > items.length / 2) target -= items.length;
                  if (diff < -items.length / 2) target += items.length;
                  targetPosition.current = target;
                }}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${i === activeIndex ? 'w-8 bg-green-500' : 'w-2.5 bg-gray-300 dark:bg-gray-700 hover:bg-green-300'
                  }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NacosSection;