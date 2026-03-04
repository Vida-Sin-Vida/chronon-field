'use client';

import { useState, useRef, useEffect } from 'react';
import { useGlobal } from '../context/GlobalContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const {
        brightness, updateBrightness,
        blueLight, updateBlueLight,
        language, changeLanguage,
        t, mounted
    } = useGlobal();
    const panelRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!mounted) return null;

    const languages = [
        { code: 'fr', label: 'FR' },
        { code: 'en', label: 'EN' },
        { code: 'es', label: 'ES' },
        { code: 'de', label: 'DE' },
        { code: 'zh', label: 'ZH' }
    ];

    return (
        <div className="relative" ref={panelRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 border ${isOpen ? 'bg-accent/10 border-accent/40 text-accent scale-105' : 'bg-transparent border-transparent text-secondary hover:text-accent hover:border-secondary/20 hover:scale-105 active:scale-95'}`}
                aria-label={t('settings')}
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 md:left-auto md:right-0 top-full mt-3 w-72 bg-background/95 backdrop-blur-xl border border-secondary/20 shadow-2xl rounded-2xl p-6 z-[100] flex flex-col gap-8"
                    >
                        <h3 className="text-sm font-serif font-bold text-accent border-b border-accent/10 pb-2">{t('settings')}</h3>

                        {/* Language Control */}
                        <div className="flex flex-col gap-3">
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">{t('language')}</span>
                            <div className="flex flex-wrap gap-2">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => changeLanguage(lang.code)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 border ${language === lang.code
                                            ? 'bg-accent text-white border-accent shadow-md'
                                            : 'bg-white/50 text-secondary border-gray-100 hover:border-accent/30 hover:text-accent'}`}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Brightness Control */}
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                                    {t('brightness')}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-accent">{brightness}%</span>
                            </div>
                            <input
                                type="range"
                                min="30"
                                max="100"
                                value={brightness}
                                onChange={(e) => updateBrightness(Number(e.target.value))}
                                className="w-full h-1.5 bg-secondary/10 rounded-lg appearance-none cursor-pointer accent-accent"
                            />
                        </div>

                        {/* Blue Light Control */}
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#ff9900]"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                                    {t('blue_light')}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-[#ff9900]">{blueLight}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={blueLight}
                                onChange={(e) => updateBlueLight(Number(e.target.value))}
                                className="w-full h-1.5 bg-secondary/10 rounded-lg appearance-none cursor-pointer accent-[#ff9900]"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
