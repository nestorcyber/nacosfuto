import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Nav/Navbar';
import Footer from '../components/Footer';
import ScrollToTopLink from '../components/ScrollToTopLink';

const PlaceholderPage = ({ title, message }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0f172a] text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="relative">
            <Navbar />
        </div>

        <main className="flex-grow flex items-center justify-center p-6 z-10 relative">
            <div className={`
                max-w-3xl w-full text-center p-12 md:p-16 rounded-[2.5rem] 
                shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] 
                backdrop-blur-xl border border-white/20 
                transform transition-all duration-500 hover:scale-[1.01]
                ${theme === 'dark' 
                    ? 'bg-gray-900/60 shadow-black/50' 
                    : 'bg-white/70 shadow-green-900/10'
                }
            `}>
                <div className="inline-block mb-6 px-4 py-1.5 rounded-xl border border-green-500/30 bg-green-500/10 text-green-500 text-sm font-semibold tracking-wider uppercase">
                    Coming Soon
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
                    <span className="bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 bg-clip-text text-transparent animate-gradient-x">
                        {title}
                    </span>
                </h1>
                
                <p className={`text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed font-light ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {message || "We're crafting an exceptional experience. This page is currently under construction but will be ready to blow your mind soon."}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <ScrollToTopLink to="/" className="px-8 py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-lg shadow-lg shadow-green-500/30 transition-all hover:-translate-y-1">
                        Return Home
                    </ScrollToTopLink>
                    <button onClick={() => window.history.back()} className={`px-8 py-4 rounded-xl font-bold text-lg border-2 transition-all hover:-translate-y-1 ${theme === 'dark' ? 'border-white/20 hover:bg-white/10 text-white' : 'border-gray-300 hover:bg-gray-100 text-gray-800'}`}>
                        Go Back
                    </button>
                </div>
            </div>
        </main>
        <div className="z-10 relative">
            <Footer />
        </div>
    </div>
  );
};

export default PlaceholderPage;
