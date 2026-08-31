import React from 'react';
import Navbar from '../components/Nav/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { FiPlay, FiMapPin, FiCompass, FiAward, FiInfo } from 'react-icons/fi';

const CampusTour = () => {
  const { theme } = useTheme();

  // FUTO Landmark Highlights
  const landmarks = [
    {
      name: "FUTO Senate Building",
      description: "The administrative heart of the university, featuring modern architecture and housing the offices of the principal officers.",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "SEET Complex",
      description: "The School of Engineering and Engineering Technology complex, where core technical and technological lectures take place.",
      image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "University Library",
      description: "A vast repository of physical and electronic academic resources supporting research and study for all students.",
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "FUTO ICT Centre",
      description: "The technological nerve center of the campus, equipped with high-speed computers, hosting examinations and digital workshops.",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center bg-gradient-to-b from-green-500/10 via-transparent to-transparent">
        <div className="max-w-4xl mx-auto z-10 relative">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500/10 text-green-500 font-extrabold text-xs uppercase tracking-wider mb-6 border border-green-500/20">
            <FiCompass /> Explore Campus
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
            FUTO Virtual <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-400">Campus Tour</span>
          </h1>
          <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto leading-relaxed">
            Take a walk around the Federal University of Technology, Owerri. Explore our departments, lecture halls, and vibrant student hubs from anywhere in the world.
          </p>
        </div>
      </section>

      {/* Video Stage Section */}
      <main className="flex-grow max-w-5xl mx-auto w-full px-6 pb-24">
        {/* Responsive Video Container */}
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 bg-gray-950 aspect-video mb-20 group">
          <iframe 
            src="https://www.youtube.com/embed/s5WCcLKS-5I" 
            title="FUTO Campus Tour Video"
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          ></iframe>
        </div>

        {/* Landmarks Highlights */}
        <div>
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">Key Campus Landmarks</h2>
            <div className="h-1 flex-grow bg-gradient-to-r from-green-500 to-transparent rounded-full opacity-25"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {landmarks.map((landmark, idx) => (
              <div 
                key={idx}
                className={`group flex flex-col md:flex-row rounded-3xl overflow-hidden border shadow-md hover:shadow-xl transition-all duration-350 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className="md:w-2/5 h-48 md:h-auto overflow-hidden relative">
                  <img 
                    src={landmark.image} 
                    alt={landmark.name} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>
                <div className="p-6 md:w-3/5 flex flex-col justify-center">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2 group-hover:text-green-500 transition-colors">
                    <FiMapPin className="text-green-500 flex-shrink-0 text-sm" /> {landmark.name}
                  </h3>
                  <p className="opacity-75 text-sm leading-relaxed">
                    {landmark.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Facts Section */}
        <div className="mt-20 p-8 md:p-10 rounded-[2rem] bg-gradient-to-r from-green-600/10 to-teal-500/10 border border-green-500/10 flex flex-col md:flex-row items-center gap-8 text-left">
          <div className="p-4 bg-green-500 text-white rounded-2xl shadow-lg">
            <FiAward size={36} />
          </div>
          <div>
            <h4 className="text-xl font-extrabold mb-2 flex items-center gap-1.5">
              <FiInfo className="text-green-500" /> Did You Know?
            </h4>
            <p className="opacity-80 text-sm md:text-base leading-relaxed">
              Established in 1980, FUTO is the premier federal university of technology in the South-East and South-South regions of Nigeria. Our campus spanning across Ihiagwa and Eziobodo is home to leading engineers, computer scientists, and technologists.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CampusTour;
