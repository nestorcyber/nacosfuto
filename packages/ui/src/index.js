import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const base = "inline-flex items-center justify-center font-semibold rounded-xl transition-all focus:outline-none disabled:opacity-50 cursor-pointer";
  
  const variants = {
    primary: "text-white bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 shadow-glow-subtle",
    secondary: "text-gray-300 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10",
    gold: "text-black bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-md",
    danger: "text-red-400 bg-red-950/40 hover:bg-red-900/60 border border-red-800/50"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base"
  };

  return (
    <button
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Badge = ({ children, variant = 'emerald', className = '' }) => {
  const variants = {
    emerald: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    amber: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    gray: "bg-white/5 text-gray-300 border-white/10"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant] || variants.emerald} ${className}`}>
      {children}
    </span>
  );
};

export const Card = ({ children, className = '', hover = true }) => {
  return (
    <div className={`rounded-3xl p-6 bg-[#041d13] border border-emerald-500/20 ${hover ? 'transition-all hover:border-emerald-500/40 hover:-translate-y-1 shadow-lg' : ''} ${className}`}>
      {children}
    </div>
  );
};

export { Logo } from './Logo.jsx';
