import React from 'react';
import Navbar from '../components/Nav/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { FiCalendar } from 'react-icons/fi';

const AcademicCalendar = () => {
    const { theme } = useTheme();

    const rainEvents = [
        { semester: "Rain Semester", title: "Week 1: Lectures", date: "19th – 23rd Apr, 2026" },
        { semester: "Rain Semester", title: "Week 2: Lectures", date: "26th – 30th Apr, 2026" },
        { semester: "Rain Semester", title: "Week 3: Lectures", date: "3rd – 7th May, 2026" },
        { semester: "Rain Semester", title: "Week 4: Lectures", date: "10th – 14th May, 2026" },
        { semester: "Rain Semester", title: "Week 5: Lectures", date: "17th – 21st May, 2026" },
        { semester: "Rain Semester", title: "Week 6: Lectures", date: "24th – 28th May, 2026" },
        { semester: "Rain Semester", title: "Senate", date: "28th May, 2026" },
        { semester: "Rain Semester", title: "Break", date: "31st May – 4th Jun, 2026" },
        { semester: "Rain Semester", title: "Break", date: "7th – 12th Jun, 2026" },
        { semester: "Rain Semester", title: "Break", date: "14th – 19th Jun, 2026" },
        { semester: "Rain Semester", title: "Break", date: "21st – 26th Jun, 2026" },
        { semester: "Rain Semester", title: "Senate", date: "25th Jun, 2026" },
        { semester: "Rain Semester", title: "Break Ends", date: "29th Jun, 2026" },
        { semester: "Rain Semester", title: "Week 7: Lectures", date: "30th Jun – 3rd Jul, 2026" },
        { semester: "Rain Semester", title: "Week 8: Lectures", date: "6th – 10th Jul, 2026" },
        { semester: "Rain Semester", title: "Week 9: Lectures", date: "13th – 17th Jul, 2026" },
        { semester: "Rain Semester", title: "Week 10: Lectures", date: "20th – 24th Jul, 2026" },
        { semester: "Rain Semester", title: "Week 11: Lectures", date: "27th – 31st Jul, 2026" },
        { semester: "Rain Semester", title: "Senate", date: "30th Jul, 2026" },
        { semester: "Rain Semester", title: "Week 12: Lectures", date: "3rd – 7th Aug, 2026" },
        { semester: "Rain Semester", title: "Week 13: Lectures", date: "10th – 14th Aug, 2026" },
        { semester: "Rain Semester", title: "Week 14: Lectures", date: "17th – 21st Aug, 2026" },
        { semester: "Rain Semester", title: "ID EL MAULUD HOLIDAYS", date: "26th Aug, 2026" },
        { semester: "Rain Semester", title: "Senate", date: "27th Aug, 2026" },
        { semester: "Rain Semester", title: "Revision Week", date: "1st – 4th Sep, 2026" },
        { semester: "Rain Semester", title: "Commencement of Rain Semester Exams", date: "7th – 11th Sep, 2026" },
        { semester: "Rain Semester", title: "Continuation of Rain Semester Exams", date: "14th – 18th Sep, 2026" },
        { semester: "Rain Semester", title: "End of Rain Semester Exams", date: "21st – 25th Sep, 2026" },
        { semester: "Rain Semester", title: "Commencement of End of Session Break", date: "28th Sep, 2026" },
    ];

    return (
        <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#041801] text-white' : 'bg-white text-[#083002]'} transition-colors duration-300`}>
            <Navbar />
            <div className="flex-grow max-w-5xl mx-auto px-6 py-16 w-full">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                        Academic <span className="text-[#138601] dark:text-[#4bd043]">Calendar</span>
                    </h1>
                    <p className="text-base sm:text-lg opacity-80 max-w-2xl mx-auto leading-relaxed">
                        Key dates for the <span className="font-semibold">2025/2026 Academic Session</span>
                    </p>
                </header>

                {/* Rain Semester */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-gradient-to-r from-[#138601]/0 via-[#138601] to-[#138601]/0"></div>
                        <h2 className="text-2xl font-bold text-[#138601] dark:text-[#4bd043] flex items-center gap-2">
                            <FiCalendar className="text-2xl" /> Rain Semester
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-[#138601]/0 via-[#138601] to-[#138601]/0"></div>
                    </div>
                    <div className="relative border-l-4 border-[#138601]/30 ml-4 md:ml-10 space-y-6">
                        {rainEvents.map((event, index) => (
                            <div key={index} className="relative pl-8 md:pl-12">
                                <div className="absolute -left-[14px] top-1 w-6 h-6 rounded-full border-4 bg-[#138601] border-green-200 z-10 box-content"></div>
                                <div className={`p-5 rounded-2xl shadow-sm border transition-all hover:shadow-xl ${theme === 'dark' ? 'bg-[#083002] border-[#138601]/30' : 'bg-white border-gray-200'}`}>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-600`}>
                                            {event.semester}
                                        </span>
                                        <div className="flex items-center text-sm font-semibold opacity-70">
                                            <FiCalendar className="mr-2" /> {event.date}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold">
                                        {event.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default AcademicCalendar;
