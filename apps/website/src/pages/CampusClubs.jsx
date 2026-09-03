import React, { useState } from 'react';
import Navbar from '../components/Nav/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { FiSearch, FiUsers, FiCpu, FiGlobe, FiCode, FiActivity } from 'react-icons/fi';
import ScrollToTopLink from '../components/ScrollToTopLink';

// Placeholder Images
const TECH_IMG = "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80";
const GEN_IMG = "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80";

const CampusClubs = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  // Club Data
  const clubs = [
    {
      id: 1,
      name: "AWS Student Builder Group FUTO",
      category: "Tech",
      description: "Community of cloud enthusiasts learning and building on Amazon Web Services.",
      image: TECH_IMG,
      icon: <FiGlobe />,
      link: "https://chat.whatsapp.com/G6yBotu4LJ03kpUMitcgGT?s=cl&p=i&ilr=2"
    },
    {
      id: 2,
      name: "Genesys Tech Club FUTO",
      category: "Tech",
      description: "Empowering students with world-class software development skills and exposure.",
      image: TECH_IMG,
      icon: <FiCode />,
      link: "https://chat.whatsapp.com/Lwp51TSHlcAHemzfnbPiqR"
    },
    {
      id: 3,
      name: "FUTO Tech Club",
      category: "Tech",
      description: "The premier hub for all tech-savvy students in FUTO to collaborate and innovate.",
      image: TECH_IMG,
      icon: <FiCpu />,
      link: "#"
    },
    {
      id: 4,
      name: "CSC Tech Innovators Club",
      category: "Tech",
      description: "Exclusive to Computer Science students focused on pushing the boundaries of innovation.",
      image: TECH_IMG,
      icon: <FiActivity />,
      link: "#"
    },
    {
      id: 5,
      name: "GDG on Campus FUTO",
      category: "Tech",
      description: "Learn Google technologies, Android, Flutter, Firebase, and more with fellow students.",
      image: TECH_IMG,
      icon: <FiGlobe />,
      link: "https://chat.whatsapp.com/JZqcoSzoZoeFzzmyDCAwhF"
    },
    {
      id: 6,
      name: "Cybersecurity Club",
      category: "Tech",
      description: "Defending the digital realm. Learn ethical hacking and network security.",
      image: TECH_IMG,
      icon: <FiCode />,
      link: "#"
    },
    {
      id: 7,
      name: "Robotics & AI Club",
      category: "Tech",
      description: "Building the future with intelligent machines and automation.",
      image: TECH_IMG,
      icon: <FiCpu />,
      link: "#"
    },
    {
      id: 8,
      name: "IEEE FUTO SB Community",
      category: "Tech",
      description: "Fostering technological innovation and excellence for the benefit of humanity.",
      image: TECH_IMG,
      icon: <FiCpu />,
      link: "https://chat.whatsapp.com/Fab3gXDOFPT2i4g9gqav3u"
    },
    {
      id: 9,
      name: "MLSA Community FUTO",
      category: "Tech",
      description: "Microsoft Learn Student Ambassadors community for technological empowerment and growth.",
      image: TECH_IMG,
      icon: <FiCode />,
      link: "https://chat.whatsapp.com/Erxe4MH5FwpH7Vf6sVbK4C"
    },
    {
      id: 10,
      name: "Sath - FUTO AI Experience Center",
      category: "Tech",
      description: "Exploring artificial intelligence, machine learning, and automation innovations.",
      image: TECH_IMG,
      icon: <FiCpu />,
      link: "https://chat.whatsapp.com/Gh94BhSSqL3Fubfk3OVeW0"
    },
    {
      id: 11,
      name: "Interswitch Developer Community FUTO",
      category: "Tech",
      description: "Developer network focusing on fintech integrations, APIs, and digital payments.",
      image: TECH_IMG,
      icon: <FiCode />,
      link: "https://chat.whatsapp.com/EXZDh2TZGJK3ULb1OLDPPh"
    },
    {
      id: 12,
      name: "FUTO Blockchain Club",
      category: "Tech",
      description: "Exploring decentralized technologies, Web3 development, smart contracts, and cryptography.",
      image: TECH_IMG,
      icon: <FiGlobe />,
      link: "https://chat.whatsapp.com/Dlo9yIFfLDk9lCuiNcyGqZ"
    },
    {
      id: 13,
      name: "Notion FUTO",
      category: "Lifestyle",
      description: "FUTO community for Notion enthusiasts to optimize note-taking, productivity, and workspace design.",
      image: GEN_IMG,
      icon: <FiUsers />,
      link: "https://chat.whatsapp.com/BaW7OB3i9FN80bN7kwhqpx"
    },
    {
      id: 14,
      name: "Cowrywise FUTO",
      category: "Lifestyle",
      description: "Financial literacy club focusing on savings, investments, and wealth management education.",
      image: GEN_IMG,
      icon: <FiUsers />,
      link: "https://chat.whatsapp.com/Kaea2bwiwPAAiTYHwzLDP6"
    }
  ];

  // Sort clubs alphabetically by name
  const sortedClubs = [...clubs].sort((a, b) => a.name.localeCompare(b.name));

  // Search Filtering
  const filteredClubs = sortedClubs.filter(club => 
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    club.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#041801] text-white' : 'bg-white text-[#083002]'} transition-colors duration-300`}>
      <Navbar />

      {/* Hero Section */}
      <div className="relative py-20 px-6 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#138601]/10 text-[#138601] dark:text-[#4bd043] font-bold text-xs uppercase tracking-wider mb-6 border border-[#138601]/20">
            Student Life & Synergy
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Find Your <span className="text-[#138601] dark:text-[#4bd043]">Community</span>
          </h1>
          <p className="text-base sm:text-lg opacity-80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect with like-minded students, learn new skills, and build collaborative software projects in one of our campus chapters.
          </p>
          
          {/* Search Bar */}
          <div className={`flex items-center max-w-lg mx-auto p-2 rounded-xl shadow-sm border ${theme === 'dark' ? 'bg-[#083002] border-[#138601]/30' : 'bg-white border-gray-200'} transform hover:scale-[1.01] transition-all`}>
            <FiSearch className="ml-4 text-xl text-gray-400" />
            <input 
              type="text" 
              placeholder="Search for clubs (e.g. GDSC, Competitive)..." 
              className="flex-grow bg-transparent border-none focus:ring-0 px-4 py-2.5 text-sm outline-none text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Clubs Grid */}
      <main className="flex-grow px-6 pb-20 max-w-7xl mx-auto w-full">
        {filteredClubs.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {filteredClubs.map(club => (
                <div key={club.id} className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
                  theme === 'dark' ? 'bg-[#083002] border-[#138601]/30' : 'bg-white border-gray-200 shadow-sm'
                }`}>
                  {/* Image */}
                  <div className="h-48 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                    <img src={club.image} alt={club.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute bottom-4 left-4 z-20 flex items-center text-white">
                       <span className="p-2 bg-green-500 rounded-lg mr-3">
                         {club.icon}
                       </span>
                       <span className="font-bold tracking-wide text-sm uppercase opacity-90">{club.category}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-green-500 transition-colors">{club.name}</h3>
                    <p className="opacity-70 mb-6 leading-relaxed line-clamp-3">
                      {club.description}
                    </p>
                    
                    {club.link.startsWith('http') ? (
                      <a 
                        href={club.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-block w-full text-center py-3 px-6 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition-all duration-300 shadow-md hover:shadow-green-500/20"
                      >
                        Join Club
                      </a>
                    ) : (
                      <ScrollToTopLink 
                        to={club.link} 
                        className="inline-block w-full text-center py-3 px-6 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition-all duration-300 shadow-md hover:shadow-green-500/20"
                      >
                        Join Club
                      </ScrollToTopLink>
                    )}
                  </div>
                </div>
             ))}
           </div>
        ) : (
          <div className="text-center py-20 opacity-50">
             <FiUsers className="mx-auto text-6xl mb-4" />
             <h3 className="text-2xl font-bold">No clubs found</h3>
             <p>Try searching for something else like "Tech" or "Debate".</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CampusClubs;
