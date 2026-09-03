import React from 'react';

export const Logo = ({ size = 'md', showText = true, subtitle = 'FUTO Chapter' }) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  return (
    <div className="flex items-center space-x-3 group">
      <div className={`${sizeMap[size] || sizeMap.md} rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center p-1.5 transition-transform group-hover:scale-105`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" className="w-full h-full">
          <circle cx="50" cy="50" r="48" fill="#008751" stroke="#ffffff" strokeWidth="3"/>
          <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 3"/>
          <path d="M50 18 L74 28 V52 C74 67 50 78 50 78 C50 78 26 67 26 52 V28 Z" fill="#ffffff" />
          <path d="M50 22 L70 30 V50 C70 63 50 73 50 73 C50 73 30 63 30 50 V30 Z" fill="#008751" />
          <path d="M42 38 H58 V52 H42 Z" fill="#ffffff" rx="2"/>
          <path d="M38 54 H62 V57 H38 Z" fill="#ffffff" rx="1.5"/>
          <circle cx="50" cy="45" r="3" fill="#008751"/>
          <path d="M35 44 H39 M61 44 H65 M50 32 V36 M50 57 V62" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      {showText && (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-white text-base tracking-tight font-display">NACOS</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-1.5 py-0.5 rounded border border-emerald-500/30 uppercase">
              Official
            </span>
          </div>
          {subtitle && <p className="text-[11px] text-gray-400 font-medium">{subtitle}</p>}
        </div>
      )}
    </div>
  );
};

export default Logo;
