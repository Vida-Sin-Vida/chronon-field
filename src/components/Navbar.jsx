'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useGlobal } from '../context/GlobalContext';
import AnimatedLogo from './AnimatedLogo';
import useSoundEffects from '../hooks/useSoundEffects';
import SettingsMenu from './SettingsMenu';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isModalOpen, isNavbarVisible, t, language, changeLanguage } = useGlobal();
  const { playPageTransition, playHeaderClick } = useSoundEffects();

  // Trigger page transition sound on pathname change
  useEffect(() => {
    // Only play if it's not the initial mount/render
    playPageTransition();
  }, [pathname, playPageTransition]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('about'), href: '/about' },
    { name: t('program'), href: '/programme' },
    { name: t('publications'), href: '/publications' },
    { name: t('vulgarisation'), href: '/vulgarisation' },
    { name: t('software'), href: '/logiciel' },
    { name: t('contact'), href: '/contact' },
  ];

  const isHome = pathname === '/';
  const isAbout = pathname === '/about';
  const isTransparentPage = isHome || isAbout;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform ${!isNavbarVisible ? '-translate-y-full' : 'translate-y-0'
        } ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-sm py-[15px] md:py-4' : (isTransparentPage ? 'bg-transparent py-[22px] md:py-6' : 'bg-background py-[22px] md:py-6')
        }`}
      style={{
        backgroundColor: isTransparentPage && !isScrolled ? 'transparent' : (isScrolled ? 'rgba(247, 246, 243, 0.95)' : '#F7F6F3')
      }}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left Column - Logo (Fixed Width) */}
        <div className="flex-1 flex items-center justify-start min-w-[60px] md:min-w-[120px] lg:min-w-[200px] gap-4">
          {/* Gear on left for mobile only */}
          <div className={`md:hidden ${isModalOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity`}>
            <SettingsMenu />
          </div>

          <button
            onClick={playHeaderClick}
            className={`transition-all duration-1000 ease-in-out cursor-pointer hover:scale-105 active:scale-95 ${isHome
              ? 'opacity-0 blur-[20px] scale-90 pointer-events-none -translate-x-8'
              : 'opacity-100 blur-0 scale-100 translate-x-0'
              }`}
            aria-label="Home / Play Beep"
          >
            <AnimatedLogo />
          </button>
        </div>

        {/* Center Column - Navigation Links (Naturally Centered) */}
        <div className="flex-grow-0 flex items-center justify-center">
          <div
            className={`flex items-center space-x-4 lg:space-x-8 px-6 py-2 rounded-full transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isModalOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
              } ${isTransparentPage && !isScrolled ? 'bg-background/60 shadow-[0_4px_20px_rgba(247,246,243,0.8)] backdrop-blur-md' : ''} hidden md:flex`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-300 hover:text-accent whitespace-nowrap ${pathname === link.href ? 'text-accent' : 'text-secondary'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column - Gear & Menu Button (Fixed Width, balanced with Left) */}
        <div className="flex-1 flex items-center justify-end gap-4 min-w-[60px] md:min-w-[120px] lg:min-w-[200px]">
          {/* Gear on right for desktop and medium screens */}
          <div className={`hidden md:block ${isModalOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity`}>
            <SettingsMenu />
          </div>

          {/* Hamburger Menu Button (Mobile only) */}
          <button
            className={`md:hidden text-accent focus:outline-none transition-opacity duration-300 ${isModalOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-secondary/10 shadow-lg p-6 flex flex-col space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-lg font-medium transition-colors duration-200 hover:text-accent ${pathname === link.href ? 'text-accent' : 'text-secondary'
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

/*
( ~ ~ ~ Φ(x) ~ ~ ~
Benjamin Brécheteau | Chronon Field 2025
~ ~ ~ ~ ~ ~ ~ ~ ~)
*/
