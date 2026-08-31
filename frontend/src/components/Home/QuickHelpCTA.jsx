import React from 'react';
import { FiHelpCircle, FiMail, FiArrowRight } from 'react-icons/fi';
import ScrollToTopLink from '../ScrollToTopLink';
import { useTheme } from '../../context/ThemeContext';

const QuickHelpCTA = () => {
    const { theme } = useTheme();

    return (
        <section className="py-16 transition-colors duration-300 bg-white dark:bg-gray-800">
            <div className="max-w-5xl mx-auto px-6">
                <div className={`relative overflow-hidden rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border ${
                    theme === 'dark'
                        ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-green-900/30 border-gray-700'
                        : 'bg-gradient-to-br from-white via-white to-green-50 border-gray-200 shadow-lg'
                }`}>
                    {/* Decorative accent */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                    {/* Content */}
                    <div className="relative flex items-start gap-5 flex-1">
                        <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 items-center justify-center text-green-500 text-2xl flex-shrink-0">
                            <FiHelpCircle />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold mb-2 tracking-tight">
                                Need Help?
                            </h3>
                            <p className="text-sm md:text-base opacity-70 leading-relaxed max-w-lg">
                                Whether you have questions about admissions, courses, or campus life — the department is here to help. Reach out anytime.
                            </p>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="relative flex flex-col sm:flex-row gap-3 flex-shrink-0">
                        <ScrollToTopLink
                            to="/contact"
                            className="group inline-flex items-center justify-center gap-2 px-7 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md hover:shadow-green-500/20"
                        >
                            <FiMail className="text-base" />
                            Contact Us
                            <FiArrowRight className="text-sm group-hover:translate-x-0.5 transition-transform duration-300" />
                        </ScrollToTopLink>
                        <ScrollToTopLink
                            to="/faqs"
                            className={`inline-flex items-center justify-center gap-2 px-7 py-3 font-bold text-sm uppercase tracking-wider rounded-xl border-2 transition-all duration-300 ${
                                theme === 'dark'
                                    ? 'border-gray-600 hover:border-green-500 hover:text-green-400'
                                    : 'border-gray-300 hover:border-green-600 hover:text-green-700'
                            }`}
                        >
                            <FiHelpCircle className="text-base" />
                            View FAQs
                        </ScrollToTopLink>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QuickHelpCTA;
