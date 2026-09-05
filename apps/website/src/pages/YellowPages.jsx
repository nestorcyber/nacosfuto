import React, { useState } from 'react';
import Navbar from '../components/Nav/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { 
  FiSearch, 
  FiPhone, 
  FiMail, 
  FiPlus, 
  FiMapPin, 
  FiStar, 
  FiTag, 
  FiUser, 
  FiTrendingUp, 
  FiX, 
  FiCheckCircle 
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import flyerPeacemaker from '../assets/flyer_peacemaker.jpg';
import flyerNiforix from '../assets/flyer_niforix.jpg';
import flyerCypher from '../assets/flyer_cypher.jpg';
import flyerNinasBraid from '../assets/flyer_ninas_braid.jpg';
import { getCloudinaryAssetUrl } from '@nacos/media';

const YellowPages = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // New Business Form State
  const [newBusiness, setNewBusiness] = useState({
    name: '',
    category: 'Food & Drinks',
    ownerName: '',
    ownerLevel: '100 Level',
    description: '',
    location: '',
    phone: '',
    whatsapp: '',
    rating: 5.0,
    reviewsCount: 1,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
  });

  // Categories list
  const categories = [
    'All',
    'Food & Drinks',
    'Tech & Coding',
    'Graphics & Printing',
    'Fashion & Styling',
    'Gadgets & Repairs',
    'Tutoring & Books',
    'Other Services'
  ];

  // Default Indigenous Student Businesses
  const [businesses, setBusinesses] = useState([
    {
      id: 7,
      name: "Peacemaker Tech",
      category: "Gadgets & Repairs",
      secondaryCategories: ["Tech & Coding"],
      ownerName: "Peacemaker Tech",
      ownerLevel: "Student Business",
      description: "Software & Game installations, Windows upgrading/downgrading, Loading Windows on Macbook PC, installation of Windows/Mac OS apps, and general software troubleshooting.",
      location: "FUTO Campus / Hostel Delivery",
      phone: "+2347088180036",
      whatsapp: "2349161081187",
      email: "",
      rating: 5.0,
      reviewsCount: 14,
      image: getCloudinaryAssetUrl('flyer_peacemaker') || flyerPeacemaker,
      imagePosition: "top left"
    },
    {
      id: 8,
      name: "Niforix",
      category: "Graphics & Printing",
      secondaryCategories: ["Tech & Coding"],
      ownerName: "Niforix",
      ownerLevel: "Student Business",
      description: "Graphics Design, Branding, UI/UX, Website Design, CAC/NUPRC/SMEDAN Registrations, Social Media Management, Technical/Resume Writing, E-Pin sales, and IT Consulting.",
      location: "FUTO Campus / Remote 24/7",
      phone: "+2349060900245",
      whatsapp: "2349060900245",
      email: "",
      rating: 5.0,
      reviewsCount: 25,
      image: getCloudinaryAssetUrl('flyer_niforix') || flyerNiforix,
      imagePosition: "top right"
    },
    {
      id: 9,
      name: "Cypher.dev Shadow Boost",
      category: "Tech & Coding",
      secondaryCategories: ["Tech & Coding"],
      ownerName: "Cypher.dev",
      ownerLevel: "Student Business",
      description: "Official service catalogue for social growth plans (TikTok, Telegram, YouTube, Facebook, Instagram followers & engagement), 24/7 automated processing & live campaign analytics.",
      location: "https://shadow-boost.vercel.app/",
      phone: "+2348126159499",
      whatsapp: "2348126159499",
      email: "",
      rating: 4.9,
      reviewsCount: 38,
      image: getCloudinaryAssetUrl('flyer_cypher') || flyerCypher,
      imagePosition: "top center"
    },
    {
      id: 10,
      name: "Nina's Braid",
      category: "Fashion & Styling",
      ownerName: "Nina's Braid",
      ownerLevel: "Student Business",
      description: "Hair styling, braiding, and accessories on campus.",
      location: "FUTO Hostel Delivery",
      phone: "+2348000000000",
      whatsapp: "2348000000000",
      email: "",
      rating: 4.8,
      reviewsCount: 19,
      image: getCloudinaryAssetUrl('flyer_ninas_braid') || flyerNinasBraid,
      imagePosition: "top center"
    }
  ]);

  // Handle modal submit
  const handleRegisterBusiness = (e) => {
    e.preventDefault();
    if (!newBusiness.name || !newBusiness.ownerName || !newBusiness.phone || !newBusiness.description) {
      alert("Please fill in the required fields.");
      return;
    }

    // Set fallback image based on category
    let categoryImg = newBusiness.image;
    if (newBusiness.category === 'Food & Drinks') categoryImg = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80';
    else if (newBusiness.category === 'Tech & Coding') categoryImg = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
    else if (newBusiness.category === 'Graphics & Printing') categoryImg = 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=800&q=80';
    else if (newBusiness.category === 'Fashion & Styling') categoryImg = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80';
    else if (newBusiness.category === 'Gadgets & Repairs') categoryImg = 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80';
    else if (newBusiness.category === 'Tutoring & Books') categoryImg = 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80';

    const cleanWhatsapp = newBusiness.whatsapp.replace(/\D/g, '');

    const addedBusiness = {
      id: Date.now(),
      ...newBusiness,
      whatsapp: cleanWhatsapp || newBusiness.phone.replace(/\D/g, ''),
      image: categoryImg,
      rating: 5.0,
      reviewsCount: 1
    };

    setBusinesses([addedBusiness, ...businesses]);
    setIsModalOpen(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);

    // Reset Form
    setNewBusiness({
      name: '',
      category: 'Food & Drinks',
      ownerName: '',
      ownerLevel: '100 Level',
      description: '',
      location: '',
      phone: '',
      whatsapp: '',
      rating: 5.0,
      reviewsCount: 1,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
    });
  };

  // Filter listings
  const filteredBusinesses = businesses.filter(biz => {
    const matchesSearch = 
      biz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      biz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      biz.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      biz.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || 
      biz.category === selectedCategory || 
      (Array.isArray(biz.secondaryCategories) && biz.secondaryCategories.includes(selectedCategory));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#041801] text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <Navbar />

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-20 right-6 z-[60] bg-[#138601] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 border border-[#138601] animate-slide-in">
          <FiCheckCircle className="text-2xl" />
          <div>
            <p className="font-bold text-sm">Business Registered!</p>
            <p className="text-xs opacity-90">Your business has been successfully listed.</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center bg-gradient-to-b from-[#138601]/10 via-transparent to-transparent">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#138601]/10 text-[#138601] dark:text-[#4bd043] font-bold text-xs uppercase tracking-wider mb-6 border border-[#138601]/20">
            <FiTrendingUp /> Indigenous Commerce
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
            FUTO CSC <span className="text-[#138601] dark:text-[#4bd043]">Yellow Pages</span>
          </h1>
          <p className="text-lg md:text-xl opacity-80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Support and connect directly with businesses owned and operated by Computer Science students and department staff.
          </p>

          {/* Search Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-2 max-w-xl mx-auto p-1.5 rounded-xl shadow-lg border bg-white dark:bg-[#083002] border-gray-200 dark:border-[#138601]/30">
            <div className="flex-grow flex items-center px-3 py-1 w-full">
              <FiSearch className="text-gray-400 text-lg mr-2 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="Search businesses, services, owners..."
                className="w-full bg-transparent border-none text-sm outline-none focus:ring-0 focus:outline-none text-gray-900 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-7 py-2.5 bg-[#138601] hover:bg-[#0f6c01] text-white font-semibold text-sm rounded shadow-sm transition-colors cursor-pointer whitespace-nowrap w-full sm:w-auto min-h-[42px]"
            >
              <FiPlus className="text-base" /> Add Business
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 pb-24">
        {/* Category Filters */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-6 mb-10 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded font-semibold text-xs transition-colors whitespace-nowrap cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-[#138601] text-white border-[#138601] shadow-sm'
                  : 'bg-white dark:bg-[#083002] hover:bg-[#f1f3f5] dark:hover:bg-[#138601] text-gray-700 dark:text-gray-200 border-gray-200 dark:border-[#138601]/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Directory Listings */}
        {filteredBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBusinesses.map((biz) => (
              <div 
                key={biz.id}
                className={`group flex flex-col rounded overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 ${
                  theme === 'dark' ? 'bg-[#083002] border-[#138601]/30' : 'bg-white border-gray-200'
                }`}
              >
                {/* Header Image */}
                <div className="h-52 overflow-hidden relative">
                  <img 
                    src={biz.image} 
                    alt={biz.name} 
                    style={{ objectPosition: biz.imagePosition || 'center' }}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/10 text-white flex items-center text-xs font-bold gap-1 shadow">
                    <FiStar className="text-yellow-400 fill-yellow-400" /> {biz.rating.toFixed(1)} ({biz.reviewsCount})
                  </div>
                  <div className="absolute bottom-4 left-4 z-20 flex items-center text-white text-xs font-black uppercase tracking-wide gap-1">
                    <FiTag className="text-green-400" /> {biz.category}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-green-500 transition-colors line-clamp-1">
                      {biz.name}
                    </h3>

                    {/* Owner detail */}
                    <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-extrabold mb-4 uppercase tracking-wider">
                      <FiUser /> {biz.ownerName} ({biz.ownerLevel})
                    </div>

                    <p className="opacity-75 text-sm leading-relaxed mb-6 line-clamp-3">
                      {biz.description}
                    </p>
                  </div>

                  {/* Location & Contact CTA */}
                  <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-[#138601]/20">
                    <div className="flex items-center gap-2 text-xs opacity-75">
                      <FiMapPin className="text-green-500 flex-shrink-0" />
                      <span className="font-semibold line-clamp-1">{biz.location}</span>
                    </div>

                    {/* Contacts button group */}
                    <div className="grid grid-cols-2 gap-2">
                      <a 
                        href={`https://wa.me/${biz.whatsapp}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded bg-[#138601] hover:bg-[#0f6c01] text-white font-semibold text-xs transition-colors shadow-sm"
                        title="Chat on WhatsApp"
                      >
                        <FaWhatsapp className="text-sm" /> WhatsApp
                      </a>
                      <a 
                        href={`tel:${biz.phone}`} 
                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded border border-gray-300 dark:border-[#138601]/30 font-semibold text-xs hover:bg-[#f1f3f5] dark:hover:bg-[#083002] transition-colors ${
                          theme === 'dark' ? 'text-white' : 'text-gray-800'
                        }`}
                        title="Call Business"
                      >
                        <FiPhone className="text-xs" /> Call
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 opacity-60 border border-dashed border-gray-300 dark:border-[#138601]/30 rounded">
            <FiSearch className="mx-auto text-6xl mb-4 text-gray-400" />
            <h3 className="text-2xl font-black mb-1">No businesses found</h3>
            <p className="text-sm">Try searching for other terms or choose another category.</p>
          </div>
        )}
      </main>

      {/* Register Business Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden animate-zoom-in ${
            theme === 'dark' ? 'bg-[#083002] border-[#138601]/40 text-white' : 'bg-white border-gray-150 text-gray-900'
          }`}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#138601]/20">
              <h2 className="text-2xl font-black tracking-tight">Register Your Business</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-[#041801] transition-colors ${
                  theme === 'dark' ? 'text-green-200' : 'text-gray-500'
                }`}
              >
                <FiX size={20} />
              </button>
            </div>

             {/* Modal Form */}
            <form onSubmit={handleRegisterBusiness} className="p-6 overflow-y-auto max-h-[70vh] space-y-5 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Business Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. CSC Printing Shop" 
                    className="w-full px-4 py-3 rounded border border-gray-300 dark:border-[#138601]/30 bg-transparent text-sm focus:outline-none focus:border-[#138601] focus:ring-1 focus:ring-[#138601] text-gray-900 dark:text-white"
                    value={newBusiness.name}
                    onChange={(e) => setNewBusiness({...newBusiness, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Category *</label>
                  <select 
                    className="w-full px-4 py-3 rounded border border-gray-300 dark:border-[#138601]/30 bg-white dark:bg-[#041801] text-sm focus:outline-none focus:border-[#138601] text-gray-900 dark:text-white"
                    value={newBusiness.category}
                    onChange={(e) => setNewBusiness({...newBusiness, category: e.target.value})}
                  >
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Owner Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. John Doe" 
                    className="w-full px-4 py-3 rounded border border-gray-300 dark:border-[#138601]/30 bg-transparent text-sm focus:outline-none focus:border-[#138601] text-gray-900 dark:text-white"
                    value={newBusiness.ownerName}
                    onChange={(e) => setNewBusiness({...newBusiness, ownerName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Owner Year / Level</label>
                  <select 
                    className="w-full px-4 py-3 rounded border border-gray-300 dark:border-[#138601]/30 bg-white dark:bg-[#041801] text-sm focus:outline-none focus:border-[#138601] text-gray-900 dark:text-white"
                    value={newBusiness.ownerLevel}
                    onChange={(e) => setNewBusiness({...newBusiness, ownerLevel: e.target.value})}
                  >
                    <option value="100 Level">100 Level</option>
                    <option value="200 Level">200 Level</option>
                    <option value="300 Level">300 Level</option>
                    <option value="400 Level">400 Level</option>
                    <option value="500 Level">500 Level</option>
                    <option value="PG Student">PG Student</option>
                    <option value="Staff Member">Staff Member</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Business Location / Address *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Hostel C, Room 204 or Eziobodo FUTO back gate" 
                  className="w-full px-4 py-3 rounded border border-gray-300 dark:border-[#138601]/30 bg-transparent text-sm focus:outline-none focus:border-[#138601] text-gray-900 dark:text-white"
                  value={newBusiness.location}
                  onChange={(e) => setNewBusiness({...newBusiness, location: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Business Description * (Max 3 lines)</label>
                <textarea 
                  required 
                  rows="3" 
                  placeholder="Describe your services, specialties, and special student offers..." 
                  className="w-full px-4 py-3 rounded border border-gray-300 dark:border-[#138601]/30 bg-transparent text-sm focus:outline-none focus:border-[#138601] text-gray-900 dark:text-white"
                  value={newBusiness.description}
                  onChange={(e) => setNewBusiness({...newBusiness, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Phone Call Number *</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="e.g. +2348012345678" 
                    className="w-full px-4 py-3 rounded border border-gray-300 dark:border-[#138601]/30 bg-transparent text-sm focus:outline-none focus:border-[#138601] text-gray-900 dark:text-white"
                    value={newBusiness.phone}
                    onChange={(e) => setNewBusiness({...newBusiness, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">WhatsApp Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="e.g. +2348012345678" 
                    className="w-full px-4 py-3 rounded border border-gray-300 dark:border-[#138601]/30 bg-transparent text-sm focus:outline-none focus:border-[#138601] text-gray-900 dark:text-white"
                    value={newBusiness.whatsapp}
                    onChange={(e) => setNewBusiness({...newBusiness, whatsapp: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-[#138601]/20 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-300 dark:border-[#138601]/30 text-xs font-semibold rounded hover:bg-[#f1f3f5] dark:hover:bg-[#083002] transition-colors text-gray-900 dark:text-white min-h-[42px]"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-7 py-2.5 bg-[#138601] hover:bg-[#0f6c01] text-white font-semibold text-sm rounded shadow-sm transition-colors min-h-[42px]"
                >
                  Register Business
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default YellowPages;
