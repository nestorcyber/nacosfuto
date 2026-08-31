import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import ScrollToTopLink from '../ScrollToTopLink';

// Asset imports for events
import eventFoundersTable from '../../assets/event_founders_table.jpg';
import eventZonalConvention from '../../assets/event_zonal_convention.jpg';
import eventTechRewind from '../../assets/event_tech_rewind.jpg';
import eventNacosSchedule from '../../assets/event_nacos_schedule.jpg';

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80";

const UpcomingEvents = () => {
  const events = [
    {
      id: 1,
      title: "NACOS Week 2026: Synergy & Innovation",
      date: "August 2026 (Scheduled)",
      time: "10:00 AM",
      location: "FUTO ICT Center & SEET Complex",
      image: eventNacosSchedule,
      description: "A 5-day celebration featuring hackathons, gaming contests, project pitchings, industry tech talks, traditional day, and dinner night."
    },
    {
      id: 2,
      title: "FUTO Tech Rewind & Showcase 2026",
      date: "August 2026 (Upcoming)",
      time: "11:00 AM",
      location: "School of Computing Hall, FUTO",
      image: eventTechRewind,
      description: "Celebrating innovative tech breakthroughs, student developer showcases, startup demos, and community networking."
    },
    {
      id: 3,
      title: "The Founders Table 1.0",
      date: "August 2026 (Anticipated)",
      time: "12:00 PM",
      location: "CSC Seminar Hall, FUTO",
      image: eventFoundersTable,
      description: "Convened by Kelechukwu Okere and Nestor Anyanwu. Delving into tech startups, entrepreneurship, venture capital, and building products."
    },
    {
      id: 4,
      title: "16th Annual Zonal Convention (NACOS SE)",
      date: "Sept 22-26, 2026",
      time: "9:00 AM",
      location: "Ogbonnaya Onu Polytechnic, Aba",
      image: eventZonalConvention,
      description: "Theme: d.i.g.i.t (Develop, Innovate, Grow, Inspire, Transform). Featuring keynote talks, hackathons, and regional networking."
    }
  ];

  const [showAll] = useState(false);
  const displayedEvents = showAll ? events : events.slice(0, 4);

  return (
    <section className="py-24 bg-white dark:bg-[#041801] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f2fbf1] dark:bg-[#083002] border border-[#138601]/30 text-[#138601] dark:text-[#4bd043] text-xs font-extrabold uppercase tracking-widest mb-4 shadow-sm">
            CALENDAR & ACTIVITIES
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#083002] dark:text-white tracking-tight mb-4">
            Upcoming <span className="bg-gradient-to-r from-[#138601] to-[#3db92c] bg-clip-text text-transparent">Events</span>
          </h2>
          <p className="text-base sm:text-lg text-[#083002]/70 dark:text-green-100/70 leading-relaxed">
            Stay updated with department hackathons, technical conferences, conventions, and networking sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {displayedEvents.map((event) => (
            <div
              key={event.id}
              className="group flex flex-col sm:flex-row rounded-3xl overflow-hidden border border-[#138601]/20 dark:border-[#138601]/30 bg-[#f8fdf7] dark:bg-[#083002] shadow-md hover:shadow-2xl hover:border-[#138601] dark:hover:border-[#4bd043] transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="sm:w-2/5 h-56 sm:h-auto overflow-hidden relative bg-[#041801]">
                <img
                  src={event.image || PLACEHOLDER_IMG}
                  alt={event.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-[#138601] text-white px-3 py-1 rounded-lg font-extrabold text-[10px] uppercase tracking-wider shadow-md">
                  UPCOMING
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-7 sm:w-3/5 flex flex-col justify-between text-[#083002] dark:text-white">
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[#138601] dark:group-hover:text-[#4bd043] transition-colors leading-snug">
                    {event.title}
                  </h3>
                  <p className="text-[#083002]/75 dark:text-green-100/75 text-sm leading-relaxed mb-6 line-clamp-2">
                    {event.description}
                  </p>
                </div>
                
                <div className="space-y-2 border-t pt-4 border-[#138601]/15 dark:border-white/10 text-xs text-[#083002]/70 dark:text-green-100/70">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-[#138601] dark:text-[#4bd043]" />
                    <span className="font-bold text-[#083002] dark:text-white">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-[#138601] dark:text-[#4bd043]" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#138601] dark:text-[#4bd043]" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <ScrollToTopLink
            to="/events"
            className="inline-block bg-[#138601] hover:bg-[#0f6c01] text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-[#138601]/30 hover:scale-105 transition-all duration-300 text-sm tracking-wide"
          >
            View All Department Events &rarr;
          </ScrollToTopLink>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
