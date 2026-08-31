import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FiArrowRight } from 'react-icons/fi';
import devNestor from '../assets/nacos8.jpg';
import devKelechi from '../assets/nacos9.jpg';
import devChukwudumebi from '../assets/nacos10.jpg';
import devDaniel from '../assets/nacos11.jpg';

const TechTeamSection = () => {
    const { theme } = useTheme();

    const team = [
        {
            name: "Nestor Anyanwu",
            role: "Product Manager",
            association: "Lead PM, NACOS FUTO",
            image: devNestor,
            portfolio: "https://www.linkedin.com/in/nestoranyanwu/",
            track: "Product & Architecture"
        },
        {
            name: "Kelechukwu Okere",
            role: "QA Tester",
            association: "QA Lead, NACOS FUTO",
            image: devKelechi,
            portfolio: "https://www.linkedin.com/in/kelechukwu-okere-7173b52a7/",
            track: "Quality & System Testing"
        },
        {
            name: "Chukwudumebi Oruche",
            role: "Developer",
            association: "Full-Stack Dev, NACOS FUTO",
            image: devChukwudumebi,
            portfolio: "https://www.linkedin.com/in/dumebioruche/",
            track: "Systems & API Logic"
        },
        {
            name: "Daniel Maduka",
            role: "Developer",
            association: "Full-Stack Dev, NACOS FUTO",
            image: devDaniel,
            portfolio: "https://www.linkedin.com/in/daniel-maduka-a312b7345/",
            track: "UI & Client State"
        }
    ];

    return (
        <section className="py-20 border-t bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                    Developed by the ICT Team
                </h2>
                <p className="text-base md:text-lg opacity-75 max-w-2xl mx-auto mb-16 leading-relaxed">
                    NACOS Synergy Executives 2025/2026.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto justify-items-center">
                    {team.map((member, index) => (
                        <div
                            key={index}
                            className={`w-full max-w-[280px] rounded-3xl overflow-hidden border shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative flex flex-col justify-between ${theme === 'dark' ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200/80 text-gray-900'
                                }`}
                        >
                            {/* Top abstract mesh gradient background */}
                            <div className="h-20 w-full bg-gradient-to-r from-green-500/20 via-teal-500/30 to-blue-500/20 relative">
                                <div className="absolute inset-0 backdrop-blur-sm" />
                            </div>

                            {/* Overlapping Profile Photo */}
                            <div className="-mt-12 flex justify-center z-10">
                                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-green-500 to-teal-400 shadow-xl">
                                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Info & Details */}
                            <div className="px-6 pt-4 pb-6 flex-grow flex flex-col justify-between text-center items-center">
                                <div>
                                    <h3 className="text-lg font-black tracking-tight mb-1">{member.name}</h3>
                                    <p className="text-xs font-bold text-green-500 mb-3 uppercase tracking-wider">{member.role}</p>

                                    <span className="inline-block text-[10px] font-extrabold text-gray-500 dark:text-gray-400 mb-6 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700/50">
                                        {member.association}
                                    </span>
                                </div>

                                {/* Portfolio CTA Button */}
                                <a
                                    href={member.portfolio}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow hover:shadow-green-500/20 cursor-pointer"
                                >
                                    View Portfolio <FiArrowRight />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TechTeamSection;
