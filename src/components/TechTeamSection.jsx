import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import devVictor from '../assets/executives/ict_asst_victory.jpg';
import devIfeanyi from '../assets/executives/ict_dir_ifeanyi.jpg';
import devDaniel from '../assets/executives/daniel_chukwuka.jpg';
import devDavid from '../assets/executives/state_ict_okikere.jpg';

const TechTeamSection = () => {
    const team = [
        {
            name: "Nestor Anyanwu",
            role: "Fullstack / Lead Dev",
            association: "Director of ICT, NACOS FUTO",
            image: devIfeanyi,
            portfolio: "https://www.linkedin.com/in/anyanwu-ifeanyichukwu-63309a250/",
            track: "Full-Stack & Systems"
        },
        {
            name: "Victory Otuonye",
            role: "Frontend Engineer",
            association: "Asst. Director of ICT, NACOS FUTO",
            image: devVictor,
            portfolio: "https://www.linkedin.com/in/victory-otuonye-a99166324/",
            track: "Frontend & Architecture"
        },
        {
            name: "Kelechukwu Okere",
            role: "Lead Software Architect",
            association: "State Director of ICT, NACOS Imo",
            image: devDavid,
            portfolio: "https://www.linkedin.com/in/kelechi-okere-854722245/",
            track: "Backend & Cloud"
        },
        {
            name: "Daniel Chukwuka",
            role: "Frontend Engineer",
            association: "Full-Stack Dev, NACOS FUTO",
            image: devDaniel,
            portfolio: "https://www.linkedin.com/in/daniel-maduka-a312b7345/",
            track: "UI & Client State"
        }
    ];

    return (
        <section className="py-24 bg-white dark:bg-[#041801] border-t border-[#138601]/20 dark:border-[#138601]/30 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f2fbf1] dark:bg-[#083002] border border-[#138601]/30 text-[#138601] dark:text-[#4bd043] text-xs font-extrabold uppercase tracking-widest mb-4 shadow-sm">
                    NACOS TECH CREW
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#083002] dark:text-white mb-4 tracking-tight leading-tight">
                    Developed by the <span className="bg-gradient-to-r from-[#138601] to-[#3db92c] bg-clip-text text-transparent">ICT Team</span>
                </h2>
                <p className="text-base sm:text-lg text-[#083002]/70 dark:text-green-100/70 max-w-2xl mx-auto mb-16 leading-relaxed">
                    Built with passion by the NACOS Synergy ICT Developers 2025/2026.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto justify-items-center">
                    {team.map((member, index) => (
                        <div
                            key={index}
                            className="w-full max-w-[280px] rounded-3xl overflow-hidden border border-[#138601]/20 dark:border-[#138601]/30 bg-[#f8fdf7] dark:bg-[#083002] shadow-md hover:shadow-2xl hover:border-[#138601] dark:hover:border-[#4bd043] hover:-translate-y-2 transition-all duration-500 relative flex flex-col justify-between"
                        >
                            {/* Top abstract gradient mesh */}
                            <div className="h-20 w-full bg-gradient-to-r from-[#138601]/30 via-[#3db92c]/40 to-[#083002]/30 relative">
                                <div className="absolute inset-0 backdrop-blur-sm" />
                            </div>

                            {/* Overlapping Profile Photo */}
                            <div className="-mt-12 flex justify-center z-10">
                                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#138601] to-[#4bd043] shadow-xl">
                                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-[#083002] bg-[#041801]">
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
                                    <h3 className="text-lg font-black text-[#083002] dark:text-white tracking-tight mb-1">{member.name}</h3>
                                    <p className="text-xs font-extrabold text-[#138601] dark:text-[#4bd043] mb-3 uppercase tracking-wider">{member.role}</p>

                                    <span className="inline-block text-[10px] font-bold text-[#083002]/80 dark:text-green-200/80 mb-6 bg-white dark:bg-[#041801] px-3 py-1.5 rounded-xl border border-[#138601]/20 dark:border-[#138601]/30">
                                        {member.association}
                                    </span>
                                </div>

                                <a
                                    href={member.portfolio}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#138601] hover:bg-[#0f6c01] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md shadow-[#138601]/30 cursor-pointer"
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
