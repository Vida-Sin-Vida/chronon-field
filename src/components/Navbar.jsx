'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useGlobal } from '../context/GlobalContext';
import AnimatedLogo from './AnimatedLogo';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isModalOpen, isNavbarVisible, t, language, toggleLanguage } = useGlobal();

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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform ${!isNavbarVisible ? '-translate-y-full' : 'translate-y-0'
        } ${isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
        }`}
    >
      <div className="container mx-auto px-6 flex items-center h-16 relative">
        {/* Logo Section - Left Aligned */}
        <div className="w-32 lg:w-48 flex-shrink-0 flex items-center">
          <div
            className={`transition-all duration-1000 ease-in-out ${isHome
              ? 'opacity-0 blur-[20px] scale-90 pointer-events-none -translate-x-8'
              : 'opacity-100 blur-0 scale-100 translate-x-0'
              }`}
          >
            <AnimatedLogo />
          </div>
        </div>

        {/* Navigation Links - Centered on Home, Slid Right on Pages */}
        <div className="flex-grow flex items-center justify-center relative h-full">
          <div
            className={`flex items-center space-x-6 lg:space-x-8 transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isModalOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
              } ${isHome
                ? 'translate-x-0'
                : 'md:translate-x-[15%] lg:translate-x-[20%] xl:translate-x-[25%]'
              } hidden md:flex`}
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

        {/* Language Toggle - Fixed on the right (hidden on mobile) */}
        <div className="w-32 lg:w-48 flex-shrink-0 flex justify-end items-center hidden md:flex">
          <button
            onClick={toggleLanguage}
            className={`text-xs md:text-sm font-medium text-secondary hover:text-accent transition-all duration-300 border border-secondary/20 rounded-full px-3 py-1 hover:border-accent/50 ${isModalOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
          >
            {language === 'fr' ? 'EN' : 'FR'}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden absolute right-6 text-accent focus:outline-none transition-opacity duration-300 ${isModalOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
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
          <div className="pt-4 border-t border-secondary/10">
            <button
              onClick={() => {
                toggleLanguage();
                setIsMobileMenuOpen(false);
              }}
              className="text-lg font-medium text-left text-secondary hover:text-accent transition-colors flex items-center space-x-2"
            >
              <span>{language === 'fr' ? 'Switch to English' : 'Passer en Français'}</span>
              <span className="text-xs border border-secondary/20 rounded-full px-2 py-0.5">
                {language === 'fr' ? 'EN' : 'FR'}
              </span>
            </button>
          </div>
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
