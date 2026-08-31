import React from 'react';
import { useLocation } from 'react-router-dom';
import ScrollToTopLink from '../ScrollToTopLink';

/**
 * Reusable NavLink Component
 * Handles active state styling and consistent link behavior
 */
const NavLink = ({ 
  to, 
  children, 
  icon: Icon, 
  mobile = false, 
  className = '', 
  onClick 
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const baseClasses = mobile 
    ? 'block py-4 text-lg'
    : 'flex items-center transition-colors font-medium';

  // Default colors (Dark mode / Fallback)
  // If active: Green
  // If inactive: Gray-300 hover:Green
  // BUT if className provides text color (like text-black), we need to handle that.
  // The easiest way is to apply defaults ONLY if no text color is in className? 
  // Or better, let parent control distinct active/inactive colors via props if needed, but for now strict logic:
  
  // Logic: 
  // If active -> Always Green (or specific active color).
  // If inactive -> Default color (Gray/White/Black depending on theme).
  
  // Note: Parent passes "text-black" when theme is light.
  // So: `${baseClasses} ${isActive ? 'text-green-500' : className || 'text-gray-300 hover:text-green-400'}`
  // Let's rely on standard conditional class application.

  let colorClasses = '';
  if (isActive) {
      colorClasses = 'text-green-500';
  } else {
      // If parent passed a class, use it (likely contains text color), else default to dark mode gray
      colorClasses = className ? className : 'text-gray-300 hover:text-green-400';
  }

  return (
    <ScrollToTopLink
      to={to}
      className={`${baseClasses} ${colorClasses}`}
      onClick={onClick}
    >
      {Icon && <Icon className={`inline ${mobile ? 'mr-3' : 'mr-2'}`} />}
      {children}
    </ScrollToTopLink>
  );
};

export default NavLink;