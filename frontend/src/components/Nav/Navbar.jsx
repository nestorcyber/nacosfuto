import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import ResourcesOverlay from './ResourcesOverlay';
import logoLight from '../../assets/full-logo-light.png';
import logoDark from '../../assets/full-logo-dark.png';
import ScrollToTopLink from '../ScrollToTopLink';

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
            ? 'fixed bg-transparent border-b border-white/10'
            : `sticky shadow-xl border-b ${
                theme === 'light'
                  ? 'bg-white border-gray-200'
                  : 'bg-gray-900 border-gray-800'
              }`
        }`}
      >
        <div className="flex items-center h-16 mx-auto px-4 w-full">
          <div className="flex items-center flex-shrink-0 mr-8">
            <ScrollToTopLink to="/" className="flex items-center">
              <img
                src={isNacosExec || theme === 'dark' ? logoDark : logoLight}
                alt="FUTO Computer Science Logo"
                className="h-6 md:h-8 lg:h-8 w-auto object-contain transition-all duration-300"
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
            className={`md:hidden p-2 cursor-pointer transition-colors ${
              isNacosExec
                ? 'text-white hover:bg-white/10'
                : theme === 'light'
                ? 'text-[#0a2e13] hover:bg-gray-100'
                : 'text-white hover:bg-gray-800'
            }`}
            aria-label="Toggle mobile menu"
          >
            {mobileNavOpen ? '✕' : '☰'}
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
