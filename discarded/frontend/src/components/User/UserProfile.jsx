import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import ScrollToTopLink from '../ScrollToTopLink';

export default function UserProfile() {
  const { user } = useAuth();
  const profileRef = useRef();
  const initialsRef = useRef();

  useGSAP(() => {
    if (!initialsRef.current) return;
    
    // Initial animation
    gsap.from(initialsRef.current, {
      scale: 0,
      duration: 0.5,
      ease: "back.out(1.7)"
    });

    // Hover animation
    gsap.to(initialsRef.current, {
      boxShadow: "0 0 0 3px rgba(74, 222, 128, 0.5)",
      duration: 0.3,
      paused: true
    });

    const onHover = () => gsap.to(initialsRef.current, { scale: 1.1, duration: 0.3 });
    const onHoverOut = () => gsap.to(initialsRef.current, { scale: 1, duration: 0.3 });

    const current = initialsRef.current;
    current.addEventListener('mouseenter', onHover);
    current.addEventListener('mouseleave', onHoverOut);

    return () => {
      current.removeEventListener('mouseenter', onHover);
      current.removeEventListener('mouseleave', onHoverOut);
    };
  }, []);

  if (!user) return null;

  return (
    <div className="flex items-center space-x-4">
      <ScrollToTopLink
        to="/profile" 
        ref={profileRef}
        className="group relative flex items-center space-x-2"
      >
        <div 
          ref={initialsRef}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 dark:from-green-600 dark:to-teal-700 flex items-center justify-center shadow-md cursor-pointer transition-all duration-300"
        >
          <span className="text-white font-medium text-lg">
            {user.first_name?.[0]}{user.last_name?.[0]}
          </span>
        </div>
       
      </ScrollToTopLink>
    </div>
  );
}