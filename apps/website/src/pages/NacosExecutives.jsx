import React from 'react';
import Navbar from '../components/Nav/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import execGroupImg from '../assets/nacos_exec_group.jpg';
import TechTeamSection from '../components/TechTeamSection';
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

// New Executive Images
import danielImg from '../assets/executives/daniel_chukwuka.jpg';
import presidentImg from '../assets/executives/president_irechukwu.jpg';
import vpImg from '../assets/executives/vp_chinaemerem.jpg';
import secGenImg from '../assets/executives/sec_gen_makuochukwu.jpg';
import asgImg from '../assets/executives/asg_chinecherem.jpg';
import treasurerImg from '../assets/executives/treasurer_chikamso.jpg';
import welfareImg from '../assets/executives/welfare_onyoiza.jpg';
import proImg from '../assets/executives/pro_john.jpg';
import ictImg from '../assets/executives/ict_dir_ifeanyi.jpg';
import ictAsstImg from '../assets/executives/ict_asst_victory.jpg';
import socialsImg from '../assets/executives/socials_dir_munachimso.jpg';
import sportsImg from '../assets/executives/sports_dir_ifeanyi.jpg';
import provost1Img from '../assets/executives/provost1_rosemary.jpg';
import provost2Img from '../assets/executives/provost2_chidera.jpg';


import rubyImg from '../assets/executives/msrc_ruby.jpg';
import ogbuImg from '../assets/executives/hon_ogbu.jpg';

import { getCloudinaryAssetUrl } from '@nacos/media';

const NacosExecutives = () => {
    const { theme } = useTheme();

    const currentExecutives = [
        { role: "President", name: "High Comrade Irechukwu Emmanuel S.", level: "400 Level", image: getCloudinaryAssetUrl('president_irechukwu', { preset: 'card' }) || presidentImg },
        { role: "Vice President", name: "Comrade Okolie Chinaemereme E.", level: "300 Level", image: getCloudinaryAssetUrl('vp_chinaemerem', { preset: 'card' }) || vpImg },
        { role: "Secretary General", name: "High Comrade Egwuonwu Makuochukwu V.", level: "400 Level", image: getCloudinaryAssetUrl('sec_gen_makuochukwu', { preset: 'card' }) || secGenImg },
        { role: "Ass. Secretary General", name: "Comrade Jibulu Chinecherem Favour", level: "300 Level", image: getCloudinaryAssetUrl('asg_chinecherem', { preset: 'card' }) || asgImg },
        { role: "Financial Secretary", name: "Comrade Nzeh Daniel Chukwuka", level: "300 Level", image: getCloudinaryAssetUrl('daniel_chukwuka', { preset: 'card' }) || danielImg },
        { role: "Treasurer", name: "Comrade Pedro Dennis Chikamso", level: "300 Level", image: getCloudinaryAssetUrl('treasurer_chikamso', { preset: 'card' }) || treasurerImg },
        { role: "P.R.O", name: "Journalist Comrade Balogun John M.", level: "300 Level", image: getCloudinaryAssetUrl('pro_john', { preset: 'card' }) || proImg },
        { role: "Director of Welfare", name: "Comrade Jonathan Faith Onyoiza", level: "200 Level", image: getCloudinaryAssetUrl('welfare_onyoiza', { preset: 'card' }) || welfareImg },
        { role: "Director of ICT", name: "Comrade Anyanwu Nestor Ifeanyi", level: "200 Level", image: getCloudinaryAssetUrl('ict_dir_ifeanyi', { preset: 'card' }) || ictImg },
        { role: "Asst. Director of ICT", name: "Comrade Okere Kelechukwu Victory", level: "200 Level", image: getCloudinaryAssetUrl('ict_asst_victory', { preset: 'card' }) || ictAsstImg },
        { role: "Director of Socials", name: "Comrade Ikenna Elvis Munachimso", level: "300 Level", image: getCloudinaryAssetUrl('socials_dir_munachimso', { preset: 'card' }) || socialsImg },
        { role: "Director of Sports", name: "Comrade Azubuike Ebenezer Ifeanyi", level: "300 Level", image: getCloudinaryAssetUrl('sports_dir_ifeanyi', { preset: 'card' }) || sportsImg },
        { role: "Provost 1", name: "Comrade Emeka Mmesoma Rosemary", level: "200 Level", image: getCloudinaryAssetUrl('provost1_rosemary', { preset: 'card' }) || provost1Img },
        { role: "Provost 2", name: "Comrade Nduka Anselem Chidera", level: "200 Level", image: getCloudinaryAssetUrl('provost2_chidera', { preset: 'card' }) || provost2Img },
        { role: "MSRC", name: "HON. Ogbu Promise Ruby Ucha", level: "300 Level", image: getCloudinaryAssetUrl('msrc_ruby', { preset: 'card' }) || rubyImg },
    ];

    const pastExecutives = [
        {
            role: "President",
            name: "Comr. JOHNSON EDIDIONG EKPO",
            level: "Graduate",
            image: nacos1
        },
        {
            role: "Vice President",
            name: "Comr. BENJAMIN CHIAGOZIE P.",
            level: "Graduate",
            image: nacos2
        },
        {
            role: "Secretary General",
            name: "Comr. OKECHUKWU CHIDERA A.",
            level: "Graduate",
            image: nacos3
        },
        {
            role: "Ass. Secretary General",
            name: "Comr. OGBONNA FAVOUR A.",
            level: "Graduate",
            image: nacos4
        },
        {
            role: "Treasurer",
            name: "Comr. Egwu Makuochukwu V.",
            level: "Graduate",
            image: nacos5
        },
        {
            role: "P.R.O",
            name: "Barr. Comr. Chimeziri Freedom C.",
            level: "Graduate",
            image: nacos6
        },
        {
            role: "Director of Welfare",
            name: "Comr. UGORJI TREASURE C.",
            level: "Graduate",
            image: nacos7
        },
        {
            role: "Director of ICT 1",
            name: "Barr. Comr. GODWIN FAITHFUL C.",
            level: "Graduate",
            image: nacos8
        },
        {
            role: "Director of ICT 2",
            name: "Comr. IRECHUKWU EMMANUEL S.",
            level: "Graduate",
            image: nacos9
        },
        {
            role: "Director of Sports",
            name: "Comr. OPARAK CHIDIEBERE D.",
            level: "Graduate",
            image: nacos10
        },
        {
            role: "Director of Socials",
            name: "Comr. ONWUBIKO KAMSIYOCHI D.",
            level: "Graduate",
            image: nacos11
        },
        {
            role: "Provost",
            name: "Comr. MADUBUIKE NZUBECHUKWU D.",
            level: "Graduate",
            image: nacos12
        },
        {
            role: "MSRC",
            name: "Hon. Ogbu Promise Ucha",
            level: "Graduate",
            image: ogbuImg
        }
    ];

    return (
        <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <Navbar />
            
            <main className="flex-grow">
                {/* Hero section with group photo - edge-to-edge */}
                <div className="relative w-full h-[55vh] min-h-[450px] md:min-h-[550px] bg-gray-950 overflow-hidden shadow-2xl mb-16">
                    <img 
                        src={execGroupImg} 
                        alt="NACOS Executives Group 2026" 
                        className="w-full h-full object-cover object-[center_30%] md:object-[center_25%] animate-fade-in" 
                    />
                    {/* Dark gradient overlay that blends at the bottom and top for navbar readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-black/45"></div>
                    
                    {/* Text content overlaid on the bottom - aligned with the content container */}
                    <div className="absolute bottom-0 left-0 right-0 w-full p-8 md:p-12 text-white">
                        <div className="max-w-7xl mx-auto px-6 w-full text-left flex flex-col items-start">
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 drop-shadow-md">
                                NACOS EXECUTIVES <span className="text-green-400">2026</span>
                            </h1>
                            <p className="text-base md:text-lg opacity-90 max-w-2xl drop-shadow-sm leading-relaxed">
                                Meet the team elected to serve and represent the students of the Department of Computer Science.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Grid Content Container */}
                <div className="max-w-7xl mx-auto px-6 pb-20 w-full">
                    
                    {/* Section 1: Current Executives */}
                    <div className="mb-20">
                        <div className="flex items-center gap-4 mb-10">
                            <h2 className="text-2xl md:text-3xl font-black tracking-tight">Current Executives (2025/2026)</h2>
                            <div className="h-1 flex-grow bg-gradient-to-r from-green-500 to-transparent rounded-full opacity-35"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                            {currentExecutives.map((exec, index) => (
                                <div 
                                    key={index} 
                                    className={`w-full max-w-[260px] mx-auto flex flex-col border p-3 shadow-sm transition-all duration-300 rounded ${
                                        theme === 'dark' 
                                            ? 'bg-[#083002] border-[#138601]/40 text-white' 
                                            : 'bg-white border-gray-200 text-gray-900'
                                    }`}
                                >
                                    {/* Bounding box for image */}
                                    <div className={`border overflow-hidden rounded aspect-[4/4.5] flex items-center justify-center ${theme === 'dark' ? 'border-[#138601]/20 bg-gray-900/60' : 'border-gray-200 bg-gray-100'}`}>
                                        {exec.image ? (
                                            <img 
                                                src={exec.image} 
                                                alt={exec.name} 
                                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-gray-400 p-3">
                                                <svg className="w-12 h-12 opacity-40 mb-1" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                                <span className="text-[10px] font-semibold opacity-60 uppercase tracking-wider">No Photo</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Divider line */}
                                    <div className={`border-t my-3 ${theme === 'dark' ? 'border-[#138601]/20' : 'border-gray-200'}`}></div>

                                    {/* Details section */}
                                    <div className="flex flex-col items-center text-center flex-grow">
                                        <h3 className={`font-bold text-base leading-tight tracking-wide uppercase ${theme === 'dark' ? 'text-white' : 'text-gray-950'}`}>
                                            {exec.name}
                                        </h3>
                                        <p className={`text-[11px] italic mt-0.5 font-medium mb-3 ${theme === 'dark' ? 'text-green-200/80' : 'text-gray-600'}`}>
                                            {exec.level}
                                        </p>
                                        
                                        {/* Position */}
                                        <h4 className={`font-extrabold text-xs uppercase tracking-wider pt-2 border-t w-full mt-auto ${
                                            theme === 'dark' 
                                                ? 'text-[#4bd043] border-[#138601]/20' 
                                                : 'text-[#138601] border-gray-100'
                                        }`}>
                                            {exec.role}
                                        </h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 2: Past Executives (2024/2025) */}
                    <div>
                        <div className="flex items-center gap-4 mb-10">
                            <h2 className="text-2xl md:text-3xl font-black tracking-tight">Past Executives (2024/2025)</h2>
                            <div className="h-1 flex-grow bg-gradient-to-r from-gray-500 to-transparent rounded opacity-35"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                            {pastExecutives.map((exec, index) => (
                                <div 
                                    key={index} 
                                    className={`w-full max-w-[260px] mx-auto flex flex-col border p-3 shadow-sm transition-all duration-300 rounded ${
                                        theme === 'dark' 
                                            ? 'bg-[#083002] border-[#138601]/40 text-white' 
                                            : 'bg-white border-gray-200 text-gray-900'
                                    }`}
                                >
                                    {/* Bounding box for image */}
                                    <div className={`border overflow-hidden rounded aspect-[4/4.5] ${theme === 'dark' ? 'border-[#138601]/20' : 'border-gray-200'}`}>
                                        <img 
                                            src={exec.image} 
                                            alt={exec.name} 
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                                        />
                                    </div>

                                    {/* Divider line */}
                                    <div className={`border-t my-3 ${theme === 'dark' ? 'border-[#138601]/20' : 'border-gray-200'}`}></div>

                                    {/* Details section */}
                                    <div className="flex flex-col items-center text-center flex-grow">
                                        <h3 className={`font-bold text-base leading-tight tracking-wide uppercase ${theme === 'dark' ? 'text-white' : 'text-gray-950'}`}>
                                            {exec.name}
                                        </h3>
                                        <p className={`text-[11px] italic mt-0.5 font-medium mb-3 ${theme === 'dark' ? 'text-green-100/70' : 'text-gray-600'}`}>
                                            {exec.level}
                                        </p>
                                        
                                        {/* Position */}
                                        <h4 className={`font-extrabold text-xs uppercase tracking-wider pt-2 border-t w-full mt-auto ${
                                            theme === 'dark' 
                                                ? 'text-[#4bd043] border-[#138601]/20' 
                                                : 'text-[#138601] border-gray-150'
                                        }`}>
                                            {exec.role}
                                        </h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Tech Team Section */}
                <TechTeamSection />
            </main>
            <Footer />
        </div>
    );
};

export default NacosExecutives;
