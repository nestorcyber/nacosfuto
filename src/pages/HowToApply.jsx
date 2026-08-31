
import React from 'react';
import Navbar from '../components/Nav/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { FiCheckSquare, FiAlertCircle } from 'react-icons/fi';
import ScrollToTopLink from '../components/ScrollToTopLink';

const HowToApply = () => {
    const { theme } = useTheme();

    return (
        <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <Navbar />
            <div className="flex-grow max-w-4xl mx-auto px-6 py-16 w-full">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black mb-6">
                        How To Apply
                    </h1>
                     <p className="text-xl opacity-80">
                        Step-by-step guide to securing your admission into FUTO CSC.
                    </p>
                </header>

                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                    {/* Step 1 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-green-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            1
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-3xl border border-slate-200 shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                           <div className="flex items-center justify-between space-x-2 mb-1">
                               <div className="font-bold text-slate-900 dark:text-slate-100">JAMB Registration</div>
                           </div>
                           <div className="text-slate-500 dark:text-slate-400">Register for the Unified Tertiary Matriculation Examination (UTME) and choose FUTO as your first choice institution.</div>
                       </div>
                    </div>

                    {/* Step 2 */}
                     <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-blue-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            2
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-3xl border border-slate-200 shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                           <div className="flex items-center justify-between space-x-2 mb-1">
                               <div className="font-bold text-slate-900 dark:text-slate-100">Post-UTME Screening</div>
                           </div>
                           <div className="text-slate-500 dark:text-slate-400">Purchase the Post-UTME form online via the FUTO Portal within the announced window. Prepare for the screening exercise.</div>
                       </div>
                    </div>

                     {/* Step 3 */}
                     <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-purple-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            3
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-3xl border border-slate-200 shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                           <div className="flex items-center justify-between space-x-2 mb-1">
                               <div className="font-bold text-slate-900 dark:text-slate-100">Check Admission Status</div>
                           </div>
                           <div className="text-slate-500 dark:text-slate-400">Regularly check the JAMB CAPS and FUTO Admission status portal. Once admitted, accept the offer on JAMB CAPS.</div>
                       </div>
                    </div>
                </div>

                <div className="mt-16 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl p-6 flex items-start">
                    <FiAlertCircle className="text-yellow-600 dark:text-yellow-400 text-3xl mr-4 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-yellow-800 dark:text-yellow-300">Important Notice</h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-200/80 mt-2">
                             Beware of fraudsters posing as admission agents. FUTO does not charge extra fees for admission outside official portal payments. Always use the official website.
                        </p>
                    </div>
                </div>
                 <div className="mt-10 text-center">
                    <a href="https://portal.futo.edu.ng" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition">
                        Go to FUTO Portal <span className="ml-2">↗</span>
                    </a>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HowToApply;
