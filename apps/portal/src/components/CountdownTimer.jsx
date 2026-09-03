import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const CountdownTimer = ({ targetDate = "2026-09-08T09:00:00Z", label = "Registration Closes In" }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 rounded-2xl p-4 md:p-6 shadow-sm">
      <div className="flex items-center gap-2 text-[#138601] dark:text-[#4bd043] text-xs md:text-sm font-semibold mb-3">
        <Clock className="w-4 h-4" />
        <span>{label}</span>
      </div>
      <div className="grid grid-cols-4 gap-2 md:gap-3 text-center">
        <div className="bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/25 rounded-xl p-2.5 md:p-3">
          <span className="block text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {String(timeLeft.days).padStart(2, '0')}
          </span>
          <span className="text-[11px] text-gray-500 dark:text-green-200/80 font-normal">Days</span>
        </div>
        <div className="bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/25 rounded-xl p-2.5 md:p-3">
          <span className="block text-2xl md:text-3xl font-bold text-[#138601] dark:text-[#4bd043] tracking-tight">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-[11px] text-gray-500 dark:text-green-200/80 font-normal">Hours</span>
        </div>
        <div className="bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/25 rounded-xl p-2.5 md:p-3">
          <span className="block text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-[11px] text-gray-500 dark:text-green-200/80 font-normal">Mins</span>
        </div>
        <div className="bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/25 rounded-xl p-2.5 md:p-3">
          <span className="block text-2xl md:text-3xl font-bold text-[#138601] dark:text-[#4bd043] tracking-tight">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-[11px] text-gray-500 dark:text-green-200/80 font-normal">Secs</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
