import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaGraduationCap, FaUsers, FaChalkboardTeacher, FaAward } from 'react-icons/fa';

const stats = [
    {
        icon: <FaAward />,
        value: 41,
        suffix: '+',
        label: 'Years of Excellence',
        description: 'Pioneering tech education since 1980'
    },
    {
        icon: <FaUsers />,
        value: 5000,
        suffix: '+',
        label: 'Students Enrolled',
        description: 'Across undergraduate and postgraduate study'
    },
    {
        icon: <FaChalkboardTeacher />,
        value: 50,
        suffix: '+',
        label: 'Academic Staff',
        description: 'Experienced professors, lecturers & researchers'
    }
];

function useCountUp(target, duration = 2000, shouldStart = false) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!shouldStart) return;

        let startTime = null;
        let animationFrame;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Ease-out cubic for smooth deceleration
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(step);
            }
        };

        animationFrame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animationFrame);
    }, [target, duration, shouldStart]);

    return count;
}

const StatCard = ({ icon, value, suffix, label, description, delay, isVisible }) => {
    const count = useCountUp(value, 2200, isVisible);

    return (
        <div
            className="group relative flex flex-col items-center text-center p-8 rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            style={{ transitionDelay: `${delay}ms` }}
        >
            {/* Glowing icon circle */}
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 text-2xl mb-5 group-hover:scale-110 group-hover:bg-green-500/20 transition-all duration-300">
                {icon}
            </div>

            {/* Counter */}
            <div className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                <span className="bg-gradient-to-br from-green-500 to-emerald-600 bg-clip-text text-transparent">
                    {count.toLocaleString()}{suffix}
                </span>
            </div>

            {/* Label */}
            <h3 className="text-base font-bold uppercase tracking-wider mb-2 text-gray-900 dark:text-white">
                {label}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-[240px]">
                {description}
            </p>
        </div>
    );
};

const DepartmentStats = () => {
    const { theme } = useTheme();
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.25 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="py-20 transition-colors duration-300 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white"
        >
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                        Department at a <span className="text-green-500">Glance</span>
                    </h2>
                    <p className="text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
                        Key figures that define the Department of Computer Science, Federal University of Technology Owerri.
                    </p>
                </div>

                {/* Stats Grid - Balanced 3 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {stats.map((stat, index) => (
                        <StatCard
                            key={stat.label}
                            {...stat}
                            delay={index * 150}
                            isVisible={isVisible}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DepartmentStats;
