import React from 'react';
import { FiHelpCircle, FiMail, FiArrowRight } from 'react-icons/fi';
import ScrollToTopLink from '../ScrollToTopLink';

const QuickHelpCTA = () => {
    return (
        <section className="py-20 transition-colors duration-300 bg-[#f4faf3] dark:bg-[#041801]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border bg-white dark:bg-[#083002] border-[#138601]/20 dark:border-[#138601]/30 shadow-xl">
                    {/* Decorative accent */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#138601]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#138601]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />

                    {/* Content */}
                    <div className="relative flex items-start gap-5 flex-1">
                        <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-[#138601]/10 dark:bg-[#138601]/25 border border-[#138601]/30 items-center justify-center text-[#138601] dark:text-[#4bd043] text-2xl flex-shrink-0">
                            <FiHelpCircle />
                        </div>
                        <div>
                            <h3 className="text-2xl md:text-3xl font-black mb-2 text-[#083002] dark:text-white tracking-tight">
                                Have Questions or Need Help?
                            </h3>
                            <p className="text-sm md:text-base text-[#083002]/70 dark:text-green-100/70 leading-relaxed max-w-lg">
                                Whether you have questions about admissions, courses, curriculum, or student activities — the department is here to support you.
                            </p>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="relative flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full sm:w-auto">
                        <ScrollToTopLink
                            to="/contact"
                            className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#138601] hover:bg-[#0f6c01] text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md shadow-[#138601]/30"
                        >
                            <FiMail className="text-base" />
                            Contact Us
                            <FiArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
                        </ScrollToTopLink>
                        <ScrollToTopLink
                            to="/faqs"
                            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-bold text-sm uppercase tracking-wider rounded-xl border-2 border-[#138601]/40 text-[#083002] dark:text-white hover:bg-[#138601]/10 transition-all duration-300"
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
