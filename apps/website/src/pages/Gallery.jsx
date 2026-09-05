import React, { useState, useEffect } from 'react';
import Navbar from '../components/Nav/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { FiCamera, FiMaximize2, FiX, FiFilter } from 'react-icons/fi';
import { CloudinaryImage, getCloudinaryAssetUrl } from '@nacos/media';
import { supabase } from '@nacos/supabase';

// Local fallbacks
import galleryDeptFront from '../assets/gallery_dept_front.jpg';
import galleryStudentGroup from '../assets/gallery_student_group.jpg';
import galleryTraditionalDay from '../assets/gallery_traditional_day.jpg';
import galleryNatureHangout from '../assets/gallery_nature_hangout.jpg';
import nacos1 from '../assets/nacos1.jpg';
import nacos2 from '../assets/nacos2.jpg';
import nacos3 from '../assets/nacos3.jpg';
import nacos4 from '../assets/nacos4.jpg';
import nacos5 from '../assets/nacos5.jpg';
import nacos6 from '../assets/nacos6.jpg';
import nacos7 from '../assets/nacos7.jpg';
import nacos8 from '../assets/nacos8.jpg';
import nacos9 from '../assets/nacos9.jpg';
import nacos10 from '../assets/nacos10.jpg';
import nacos11 from '../assets/nacos11.jpg';
import nacos12 from '../assets/nacos12.jpg';

const CANONICAL_GALLERY = [
  {
    publicId: 'nacos/gallery/gallery_dept_front',
    src: getCloudinaryAssetUrl('gallery_dept_front') || galleryDeptFront,
    caption: 'NACOS Student Leaders at the Department of Computer Science (TETFUND Complex)',
    category: 'Academics'
  },
  {
    publicId: 'nacos/gallery/gallery_student_group',
    src: getCloudinaryAssetUrl('gallery_student_group') || galleryStudentGroup,
    caption: 'FUTO Computing Students Outdoor Hangout & Mixer',
    category: 'Socials'
  },
  {
    publicId: 'nacos/gallery/gallery_traditional_day',
    src: getCloudinaryAssetUrl('gallery_traditional_day') || galleryTraditionalDay,
    caption: 'Traditional Attire Cultural Day Celebrations',
    category: 'Culture'
  },
  {
    publicId: 'nacos/gallery/gallery_nature_hangout',
    src: getCloudinaryAssetUrl('gallery_nature_hangout') || galleryNatureHangout,
    caption: 'Student Community Outing & Nature Meetup',
    category: 'Socials'
  },
  {
    publicId: 'nacos/gallery/nacos1',
    src: getCloudinaryAssetUrl('nacos1') || nacos1,
    caption: 'Tech Symposium Panel Discussion with Industry Guest Speakers',
    category: 'Tech'
  },
  {
    publicId: 'nacos/gallery/nacos2',
    src: getCloudinaryAssetUrl('nacos2') || nacos2,
    caption: 'Hackathon Sprint & Collaborative Coding Arena',
    category: 'Tech'
  },
  {
    publicId: 'nacos/gallery/nacos3',
    src: getCloudinaryAssetUrl('nacos3') || nacos3,
    caption: 'Departmental Software Project Demonstration Day',
    category: 'Academics'
  },
  {
    publicId: 'nacos/gallery/nacos4',
    src: getCloudinaryAssetUrl('nacos4') || nacos4,
    caption: 'Freshmen Orientation & Computing Induction Ceremony',
    category: 'Campus Life'
  },
  {
    publicId: 'nacos/gallery/nacos5',
    src: getCloudinaryAssetUrl('nacos5') || nacos5,
    caption: 'Annual NACOS Dinner & Outstanding Scholar Awards Gala',
    category: 'Culture'
  },
  {
    publicId: 'nacos/gallery/nacos6',
    src: getCloudinaryAssetUrl('nacos6') || nacos6,
    caption: 'Hands-on Cloud & Cyber Security Workshop Session',
    category: 'Tech'
  },
  {
    publicId: 'nacos/gallery/nacos7',
    src: getCloudinaryAssetUrl('nacos7') || nacos7,
    caption: 'Departmental Sports Championship & Track Relay',
    category: 'Sports'
  },
  {
    publicId: 'nacos/gallery/nacos8',
    src: getCloudinaryAssetUrl('nacos8') || nacos8,
    caption: 'Alumni Tech Talk & Career Advisory Fireside Chat',
    category: 'Academics'
  },
  {
    publicId: 'nacos/gallery/nacos9',
    src: getCloudinaryAssetUrl('nacos9') || nacos9,
    caption: 'Women in Computing Roundtable & Mentorship Circle',
    category: 'Socials'
  },
  {
    publicId: 'nacos/gallery/nacos10',
    src: getCloudinaryAssetUrl('nacos10') || nacos10,
    caption: 'Open Source Community Code Contribution Sprint',
    category: 'Tech'
  },
  {
    publicId: 'nacos/gallery/nacos11',
    src: getCloudinaryAssetUrl('nacos11') || nacos11,
    caption: 'TETFUND Laboratory Hardware & Systems Programming Class',
    category: 'Academics'
  },
  {
    publicId: 'nacos/gallery/nacos12',
    src: getCloudinaryAssetUrl('nacos12') || nacos12,
    caption: 'Final Year Project Exhibition & Valedictory Showcase',
    category: 'Campus Life'
  }
];

const Gallery = () => {
    const { theme } = useTheme();
    const [images, setImages] = useState(CANONICAL_GALLERY);
    const [activeFilter, setActiveFilter] = useState('All');
    const [activeModalImage, setActiveModalImage] = useState(null);

    // Fetch dynamic gallery items from Supabase if added via admin dashboard
    useEffect(() => {
        async function fetchLiveGallery() {
            try {
                const { data, error } = await supabase
                    .from('website_gallery')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (!error && data && data.length > 0) {
                    const dynamicItems = data.map(d => ({
                        publicId: d.cloudinary_public_id,
                        src: d.image_url,
                        caption: d.caption || d.title,
                        category: d.category || 'Campus Life'
                    }));

                    // Deduplicate with canonical
                    const dynamicIds = new Set(dynamicItems.map(d => d.publicId));
                    setImages([...dynamicItems, ...CANONICAL_GALLERY.filter(c => !dynamicIds.has(c.publicId))]);
                }
            } catch (err) {
                console.warn('Could not query Supabase gallery:', err);
            }
        }
        fetchLiveGallery();
    }, []);

    const categories = ['All', 'Academics', 'Tech', 'Culture', 'Socials', 'Campus Life', 'Sports'];

    const filteredImages = activeFilter === 'All'
        ? images
        : images.filter(img => img.category === activeFilter);

    return (
        <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
            <Navbar />
            <div className="flex-grow max-w-7xl mx-auto px-6 py-16 w-full">
                <header className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-xs uppercase tracking-wider mb-4 border border-green-500/20">
                        Campus Life & Events • {images.length} Moments
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500">
                        Campus Life Gallery
                    </h1>
                    <p className="text-base sm:text-lg opacity-80 max-w-2xl mx-auto leading-relaxed">
                        Capturing the events, tech hackathons, and moments that define our experience at FUTO Computer Science department.
                    </p>

                    {/* Filter Pills */}
                    <div className="flex items-center justify-center flex-wrap gap-2 mt-8">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setActiveFilter(cat)}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                                    activeFilter === cat
                                        ? 'bg-[#138601] text-white shadow-md'
                                        : theme === 'dark'
                                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {filteredImages.map((img, index) => (
                        <div 
                            key={index} 
                            onClick={() => setActiveModalImage(img)}
                            className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-green-500/10"
                        >
                            <CloudinaryImage
                                src={img.publicId}
                                fallbackSrc={img.src}
                                alt={img.caption}
                                preset="gallery_preview"
                                className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5 text-white text-left">
                                <span className="p-2 bg-white/20 backdrop-blur rounded-lg text-white w-fit mb-2">
                                    <FiMaximize2 size={16} />
                                </span>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-green-400 mb-1">{img.category}</span>
                                <p className="font-semibold text-xs leading-snug drop-shadow">{img.caption}</p>
                                <span className="text-[9px] text-green-300 mt-1 font-mono">High-Resolution Photo</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for full resolution viewing */}
            {activeModalImage && (
                <div 
                    className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
                    onClick={() => setActiveModalImage(null)}
                >
                    <div 
                        className="relative max-w-4xl w-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl p-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setActiveModalImage(null)}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors cursor-pointer"
                        >
                            <FiX size={20} />
                        </button>
                        <div className="flex items-center justify-center max-h-[75vh] overflow-hidden rounded-xl bg-black">
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
                            <span className="text-xs text-green-400 font-mono mt-1 block">Official Department Archive</span>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Gallery;
