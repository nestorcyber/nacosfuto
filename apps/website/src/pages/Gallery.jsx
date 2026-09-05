import React, { useState } from 'react';
import Navbar from '../components/Nav/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { FiCamera, FiMaximize2, FiX } from 'react-icons/fi';
import { CloudinaryImage, getOptimizedImageUrl } from '@nacos/media';

import galleryDeptFront from '../assets/gallery_dept_front.jpg';
import galleryStudentGroup from '../assets/gallery_student_group.jpg';
import galleryTraditionalDay from '../assets/gallery_traditional_day.jpg';
import galleryNatureHangout from '../assets/gallery_nature_hangout.jpg';

const Gallery = () => {
    const { theme } = useTheme();
    const [activeModalImage, setActiveModalImage] = useState(null);

    const images = [
        {
            publicId: 'nacos/gallery/dept_front',
            src: galleryDeptFront,
            caption: "NACOS Student Leaders at the Department of Computer Science (TETFUND Complex)"
        },
        {
            publicId: 'nacos/gallery/student_group',
            src: galleryStudentGroup,
            caption: "FUTO Computing Students Outdoor Hangout & Mixer"
        },
        {
            publicId: 'nacos/gallery/traditional_day',
            src: galleryTraditionalDay,
            caption: "Traditional Attire Cultural Day Celebrations"
        },
        {
            publicId: 'nacos/gallery/nature_hangout',
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
                        Cloudinary CDN Optimized Media
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500">
                        Campus Life Gallery
                    </h1>
                    <p className="text-xl opacity-80 max-w-2xl mx-auto">
                        Capturing the moments that define our experience at FUTO Computer Science department with responsive, next-gen format delivery.
                    </p>
                </header>

                <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                    {images.map((img, index) => (
                        <div 
                            key={index} 
                            onClick={() => setActiveModalImage(img)}
                            className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                        >
                            <CloudinaryImage
                                src={img.publicId}
                                fallbackSrc={img.src}
                                alt={img.caption}
                                preset="gallery_preview"
                                className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 text-white text-left">
                                <span className="p-3 bg-white/20 backdrop-blur rounded-xl text-white w-fit mb-3">
                                    <FiMaximize2 size={20} />
                                </span>
                                <p className="font-bold text-sm leading-snug">{img.caption}</p>
                                <span className="text-[10px] text-green-300 mt-1 font-mono">f_auto, q_auto Cloudinary Delivery</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for full resolution viewing */}
            {activeModalImage && (
                <div 
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                    onClick={() => setActiveModalImage(null)}
                >
                    <div 
                        className="relative max-w-4xl w-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl p-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setActiveModalImage(null)}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors"
                        >
                            <FiX size={20} />
                        </button>
                        <div className="flex items-center justify-center max-h-[75vh] overflow-hidden rounded-xl">
                            <CloudinaryImage
                                src={activeModalImage.publicId}
                                fallbackSrc={activeModalImage.src}
                                alt={activeModalImage.caption}
                                preset="gallery_full"
                                className="max-h-[75vh] w-auto object-contain"
                            />
                        </div>
                        <div className="p-4 text-center text-white">
                            <p className="text-sm font-semibold">{activeModalImage.caption}</p>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Gallery;
