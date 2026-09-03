import React from 'react';
import { NavLink } from 'react-router-dom';

const ScrollToTopLink = ({ to, children, style, className, onClick, ...props }) => {
  const handleClick = (e) => {
    window.scrollTo(0, 0);
    if (onClick) onClick(e);
  };

  return (
    <NavLink to={to} onClick={handleClick} style={style} className={className} {...props}>
      {children}
    </NavLink>
  );
};

export default ScrollToTopLink;


