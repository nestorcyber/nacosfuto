import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAuth } from '../../context/AuthContext';
import { FiLogOut } from 'react-icons/fi';

export default function LogoutButton() {
  const { logout } = useAuth();
  const buttonRef = useRef();

  useGSAP(() => {
    if (!buttonRef.current) return;
    
    gsap.from(buttonRef.current, {
      x: 20,
      duration: 0.5,
      delay: 0.2
    });
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={logout}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
    >
      <FiLogOut size={16} />
      <span>Logout</span>
    </button>
  );
}