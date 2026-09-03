
import React from 'react';
import Navbar from '../components/Nav/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { FiBookOpen, FiAward, FiCheck, FiClock, FiCheckCircle } from 'react-icons/fi';
import ScrollToTopLink from '../components/ScrollToTopLink';

const AcademicPrograms = () => {
    const { theme } = useTheme();

    const programs = [
        {
            level: "Undergraduate",
            degree: "B.Tech Computer Science",
            duration: "5 Years",
            description: "A comprehensive program covering software engineering, AI, systems architecture, and theoretical computing. Designed to produce industry-ready graduates.",
            features: ["Industrial Training (SIWES)", "Capstone Projects", "Entrepreneurship Modules"]
        },
        {
            level: "Postgraduate",
            degree: "PGD Computer Science",
            duration: "1 Year",
            description: "Bridge program for non-CS graduates or those seeking to strengthen their foundational knowledge before advanced studies.",
            features: ["Intensive Coding Bootcamps", "Research Methodology", "Advanced Database Systems"]
        },
        {
            level: "Postgraduate",
            degree: "M.Sc Computer Science",
            duration: "2 Years",
            description: "Research-focused master's program allowing specialization in areas like Cybersecurity, Data Science, and Software Engineering.",
            features: ["Thesis Research", "Seminar Presentations", "Advanced Algorithms"]
        },
        {
            level: "Postgraduate",
            degree: "Ph.D Computer Science",
            duration: "3+ Years",
            description: "Advanced doctoral research contributing to the global body of knowledge in computing. Focus on novel contributions and innovation.",
            features: ["Independent Research", "Journal Publications", "Teaching Assistantship"]
        }
    ];

    return (
        <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <Navbar />
            <div className="flex-grow max-w-7xl mx-auto px-6 py-16 w-full">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                        Academic Programs
                    </h1>
                    <p className="text-xl opacity-80 max-w-3xl mx-auto mb-8">
                        From undergraduate foundations to doctoral research, FUTO CSC offers a clear pathway for every stage of your computing career.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                        <ScrollToTopLink to="/admission-requirements" className="inline-flex items-center justify-center px-7 py-2.5 text-sm font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded shadow-sm transition-colors cursor-pointer min-h-[42px]">
                            View Requirements
                        </ScrollToTopLink>
                        <ScrollToTopLink to="/how-to-apply" className="inline-flex items-center justify-center px-7 py-2.5 text-sm font-medium text-gray-900 dark:text-white bg-[#f1f3f5] dark:bg-[#083002] hover:bg-[#e9ecef] dark:hover:bg-[#138601] rounded border border-gray-200 dark:border-[#138601]/30 transition-colors cursor-pointer min-h-[42px]">
                            How to Apply
                        </ScrollToTopLink>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-8">
                    {programs.map((prog, index) => (
                        <div key={index} className={`flex flex-col md:flex-row gap-8 items-start p-8 rounded shadow-sm border transition-all ${theme === 'dark' ? 'bg-[#083002] border-[#138601]/30' : 'bg-white border-gray-200'}`}>
                            <div className="md:w-1/3 flex-shrink-0">
                                <div className="inline-block px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-bold mb-4">
                                    {prog.level}
                                </div>
                                <h2 className="text-3xl font-bold mb-2">{prog.degree}</h2>
                                <div className="flex items-center text-green-500 font-semibold mb-4">
                                    <FiClock className="mr-2" /> {prog.duration}
                                </div>
                            </div>
                            <div className="md:w-2/3">
                                <p className="text-lg opacity-80 mb-6 leading-relaxed">
                                    {prog.description}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {prog.features.map((feat, i) => (
                                        <div key={i} className="flex items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700/50">
                                            <FiCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                                            <span className="font-medium text-sm">{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};



export default AcademicPrograms;
