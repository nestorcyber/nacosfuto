import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  ...props
}) => {
  const base = "inline-flex items-center justify-center font-semibold rounded-xl transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  
  const variants = {
    primary: "text-white bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 shadow-glow-subtle",
    secondary: "text-gray-300 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10",
    gold: "text-black bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-md",
    danger: "text-red-400 bg-red-950/40 hover:bg-red-900/60 border border-red-800/50",
    outline: "text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10",
    ghost: "text-gray-400 hover:text-white hover:bg-white/5"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base"
  };

  return (
    <button
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  containerClassName = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          className={`w-full rounded-xl bg-black/40 border text-sm text-gray-100 placeholder-gray-500 focus:outline-none transition-colors ${
            Icon ? 'pl-10 pr-3.5' : 'px-3.5'
          } py-2.5 ${
            error 
              ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/30' 
              : 'border-white/10 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
      {!error && helperText && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-lg',
  className = ''
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className={`relative w-full ${maxWidth} bg-[#041d13] border border-emerald-500/20 rounded-2xl shadow-2xl p-6 overflow-hidden ${className}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div>
            {title && <h3 className="text-lg font-bold text-white">{title}</h3>}
            {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="pt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export const Table = ({ children, className = '' }) => {
  return (
    <div className={`overflow-x-auto rounded-2xl border border-emerald-500/10 bg-black/20 ${className}`}>
      <table className="w-full text-left text-sm text-gray-300">
        {children}
      </table>
    </div>
  );
};

export const Badge = ({ children, variant = 'emerald', className = '' }) => {
  const variants = {
    emerald: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    amber: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    red: "bg-red-500/20 text-red-300 border-red-500/30",
    purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
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
