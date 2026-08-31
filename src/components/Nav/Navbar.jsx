import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import ResourcesOverlay from './ResourcesOverlay';
import logoLight from '../../assets/full-logo-light.png';
import logoDark from '../../assets/full-logo-dark.png';
import ScrollToTopLink from '../ScrollToTopLink';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [desktopResourcesOpen, setDesktopResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);

  const toggleDesktopResources = () => {
    setDesktopResourcesOpen(!desktopResourcesOpen);
    document.body.style.overflow = desktopResourcesOpen ? 'auto' : 'hidden';
  };

  const toggleMobileResources = () => {
    setMobileResourcesOpen(!mobileResourcesOpen);
    document.body.style.overflow = mobileResourcesOpen ? 'auto' : 'hidden';
  };

  const closeAllMenus = () => {
    setMobileNavOpen(false);
    document.body.style.overflow = 'auto';
  };

  const location = useLocation();
  const isNacosExec = location.pathname === '/about/nacos-executives';

  return (
    <>
      <header
        className={`top-0 z-50 w-full transition-all duration-300 ${
          isNacosExec
            ? 'fixed bg-transparent border-b border-white/10 backdrop-blur-md'
            : `sticky shadow-md border-b ${
                theme === 'light'
                  ? 'bg-white border-[#138601]/15 text-[#083002]'
                  : 'bg-[#083002] border-[#138601]/25 text-white'
              }`
        }`}
      >
        <div className="flex items-center h-16 mx-auto px-4 max-w-7xl w-full">
          <div className="flex items-center flex-shrink-0 mr-8">
            <ScrollToTopLink to="/" className="flex items-center">
              <img
                src={isNacosExec || theme === 'dark' ? logoDark : logoLight}
                alt="NACOS FUTO Logo"
                className="h-7 md:h-9 w-auto object-contain transition-all duration-300"
              />
            </ScrollToTopLink>
          </div>
          <div className="flex-1 flex justify-center items-center gap-8">
            <DesktopNav
              toggleResources={toggleDesktopResources}
              toggleDarkMode={toggleTheme}
              darkMode={theme === 'dark'}
              theme={theme}
              isTransparent={isNacosExec}
            />
          </div>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className={`md:hidden p-2 rounded-lg cursor-pointer transition-colors ${
              isNacosExec
                ? 'text-white hover:bg-white/10'
                : theme === 'light'
                ? 'text-[#083002] hover:bg-[#f2fbf1]'
                : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle mobile menu"
          >
            {mobileNavOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        <MobileNav
          isOpen={mobileNavOpen}
          closeMenu={closeAllMenus}
          toggleResourcesOverlay={toggleMobileResources}
          isResourcesOpen={mobileResourcesOpen}
          toggleDarkMode={toggleTheme}
          darkMode={theme === 'dark'}
        />
      </header>

      <ResourcesOverlay
        isOpen={desktopResourcesOpen}
        closeOverlay={toggleDesktopResources}
      />
    </>
  );
};

export default Navbar;
