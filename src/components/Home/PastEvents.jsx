import React, { useState } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import ScrollToTopLink from '../ScrollToTopLink';
import { useTheme } from '../../context/ThemeContext';

import eventMaskedAffairs from '../../assets/event_masked_affairs.jpg';
import eventFoundersTable from '../../assets/event_founders_table.jpg';
import eventZonalConvention from '../../assets/event_zonal_convention.jpg';

const UpcomingEvents = () => {
  const { theme } = useTheme();
  const events = [
    {
      id: 1,
      title: "Masked Affairs: Cum and Mingle",
      date: "Aug 15, 2026",
      time: "8:00 PM",
      location: "SOPS Theatre, FUTO",
      image: eventMaskedAffairs,
      description: "Premium masked party, networking night, and social mixer hosted by the Office of the Directors of Socials. Dress code: Mask. Red carpet starts at 8:00 PM."
    },
    {
      id: 3,
      title: "The Founders Table 1.0",
      date: "August 2026 (Anticipated)",
      time: "12:00 PM",
      location: "CSC Seminar Hall, FUTO",
      image: eventFoundersTable,
      description: "Convened by Kelechukwu Okere and Nestor Anyanwu. Delving into tech startups, entrepreneurship, venture capital, and building 'The Next Big Thing'."
    },
    {
      id: 4,
      title: "16th Annual Zonal Convention (NACOS SE)",
      date: "Sept 22-26, 2026",
      time: "9:00 AM",
      location: "Ogbonnaya Onu Polytechnic, Aba",
      image: eventZonalConvention,
      description: "Theme: d.i.g.i.t (Develop, Innovate, Grow, Inspire, Transform). Featuring panel sessions, keynote talks, hackathons, and regional networking."
    }
  ];

  // Logic to show limited number initially, then expanding (user said "opens the full event list both past and present")
  // For this component, I'll just show the first 3 by default.
  // The button will navigate to a full events page or expand. User said "when the user clicks it it open the full level list both past and present".
  // I will link the button to /announcements or a dedicated /events page. For now, let's link to /announcements (News & Events) or simply expand a modal/list. linking to a page is cleaner.
  // Actually, I can make it toggle `showAll` state.

  const [showAll, setShowAll] = useState(false);
  const displayedEvents = showAll ? events : events.slice(0, 3);

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500">
            Upcoming Events
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
            Stay updated with current events
          </p>
          <div className="w-24 h-1.5 bg-green-500 mx-auto mt-6 rounded-full opacity-80"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {displayedEvents.map((event) => (
            <div
              key={event.id}
              className={`group flex flex-col lg:flex-row rounded-3xl overflow-hidden border shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              {/* Image Container */}
              <div className="lg:w-2/5 h-56 lg:h-auto overflow-hidden relative">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                <img
                  src={event.image || PLACEHOLDER_IMG}
                  alt={event.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow z-20">
                  UPCOMING
                </div>
              </div>

              {/* Content */}
              <div className="p-8 lg:w-3/5 flex flex-col justify-between text-gray-900 dark:text-white">
                <div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-green-500 transition-colors text-gray-900 dark:text-white">{event.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 line-clamp-2">{event.description}</p>
                </div>
                
                <div className="space-y-2 border-t pt-4 border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-green-500" /> <span className="font-semibold text-gray-850 dark:text-gray-200">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-green-500" /> <span className="text-gray-700 dark:text-gray-300">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-green-500" /> <span className="text-gray-700 dark:text-gray-300">{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <ScrollToTopLink
            to="/events"
            className="inline-block bg-gradient-to-r from-green-600 to-green-500 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-green-500/40 hover:scale-105 transition-all duration-300 animate-fade-in"
          >
            View All Events
          </ScrollToTopLink>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;