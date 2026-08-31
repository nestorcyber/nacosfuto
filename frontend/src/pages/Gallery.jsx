import React from 'react';
import Navbar from '../components/Nav/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { FiCamera } from 'react-icons/fi';

import galleryDeptFront from '../assets/gallery_dept_front.jpg';
import galleryStudentGroup from '../assets/gallery_student_group.jpg';
import galleryTraditionalDay from '../assets/gallery_traditional_day.jpg';
import galleryNatureHangout from '../assets/gallery_nature_hangout.jpg';

const Gallery = () => {
    const { theme } = useTheme();

    const images = [
        {
            src: galleryDeptFront,
            caption: "NACOS Student Leaders at the Department of Computer Science (TETFUND Complex)"
        },
        {
            src: galleryStudentGroup,
            caption: "FUTO Computing Students Outdoor Hangout & Mixer"
        },
        {
            src: galleryTraditionalDay,
            caption: "Traditional Attire Cultural Day Celebrations"
        },
        {
            src: galleryNatureHangout,
            caption: "Student Community Outing & Nature Meetup"
        }
    ];

    return (
        <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
            <Navbar />
            <div className="flex-grow max-w-7xl mx-auto px-6 py-16 w-full">
                <header className="text-center mb-16">
                    <span className="inline-block px-4 py-2 rounded-xl bg-green-500/10 text-green-500 font-bold text-sm mb-4 border border-green-500/20">
                        Memories & Events
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500">
                        Campus Life Gallery
                    </h1>
                    <p className="text-xl opacity-80 max-w-2xl mx-auto">
                        Capturing the moments that define our experience at FUTO Computer Science department.
                    </p>
                </header>

                <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                    {images.map((img, index) => (
                        <div key={index} className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                            <img src={img.src} alt={img.caption} className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 text-white text-left">
                                <span className="p-3 bg-white/20 backdrop-blur rounded-xl text-white w-fit mb-3">
                                    <FiCamera size={20} />
                                </span>
                                <p className="font-bold text-sm leading-snug">{img.caption}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Gallery;
