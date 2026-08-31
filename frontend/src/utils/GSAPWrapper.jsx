// components/GSAPWrapper.js
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

export default function GSAPWrapper({ children }) {
    const container = useRef();

    useGSAP(() => {
      // Global GSAP configurations
      gsap.defaults({ ease: "power3.out" });
    }, { scope: container });
  
    return <div ref={container}>{children}</div>;
  }