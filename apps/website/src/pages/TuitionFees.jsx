
import React from 'react';
import Navbar from '../components/Nav/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { FiDollarSign, FiCreditCard } from 'react-icons/fi';

const TuitionFees = () => {
    const { theme } = useTheme();

    const fees = [
        { level: "100 Level", amount: "₦180,000", items: ["Acceptance Fee excluded", "Development Levy", "Library Fee"] },
        { level: "200 Level", amount: "₦120,000", items: ["School Fees", "Departmental Dues"] },
        { level: "300 Level", amount: "₦120,000", items: ["School Fees", "SIWES Logbook"] },
        { level: "400 Level", amount: "₦120,000", items: ["School Fees", "Departmental Dues"] },
        { level: "500 Level", amount: "₦123,000", items: ["School Fees", "Final Clearance"] },
    ];

    return (
        <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <Navbar />
            <div className="flex-grow max-w-6xl mx-auto px-6 py-16 w-full">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black mb-6">
                        Tuition & Fees
                    </h1>
                    <p className="text-xl opacity-80 max-w-2xl mx-auto mb-8">
                        Breakdown of academic fees for the 2025/2026 session.
                    </p>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-lg inline-block text-sm">
                        *Fees are subject to review by the University Senate.
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {fees.map((fee, index) => (
                        <div key={index} className={`p-8 rounded border transition-all ${theme === 'dark' ? 'bg-[#083002] border-[#138601]/30' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <div className="text-center mb-6">
                                <span className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase mb-4 ${index === 0 ? 'bg-green-100 text-[#138601]' : 'bg-gray-100 dark:bg-[#041801] text-gray-500'}`}>
                                    {fee.level}
                                </span>
                                <h2 className="text-4xl font-extrabold text-green-600 dark:text-green-400 mb-2">
                                    {fee.amount}
                                </h2>
                                <p className="text-sm opacity-60">Per Session</p>
                            </div>
                            <div className="border-t border-gray-200 dark:border-[#138601]/20 pt-6">
                                <ul className="space-y-3">
                                    {fee.items.map((item, i) => (
                                        <li key={i} className="flex items-center text-sm">
                                            <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default TuitionFees;
