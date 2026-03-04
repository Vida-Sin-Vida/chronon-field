'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [language, setLanguage] = useState('fr'); // Default to French
    const [mounted, setMounted] = useState(false);
    const [brightness, setBrightness] = useState(100);
    const [blueLight, setBlueLight] = useState(0);

    useEffect(() => {
        setMounted(true);
        // Persist language preference if needed, or detect browser lang
        const savedLang = localStorage.getItem('language');
        if (savedLang && ['fr', 'en', 'es', 'de', 'zh'].includes(savedLang)) {
            setLanguage(savedLang);
        }

        // Restore display preferences
        const savedBrightness = localStorage.getItem('brightness');
        if (savedBrightness) setBrightness(Number(savedBrightness));

        const savedBlueLight = localStorage.getItem('blueLight');
        if (savedBlueLight) setBlueLight(Number(savedBlueLight));
    }, []);

    // ... language toggles ...
    const changeLanguage = (newLang) => {
        setLanguage(newLang);
        localStorage.setItem('language', newLang);
    };

    const updateBrightness = (val) => {
        setBrightness(val);
        localStorage.setItem('brightness', val);
    };

    const updateBlueLight = (val) => {
        setBlueLight(val);
        localStorage.setItem('blueLight', val);
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <GlobalContext.Provider value={{
            isModalOpen, setIsModalOpen,
            isNavbarVisible, setIsNavbarVisible,
            language, setLanguage, changeLanguage,
            brightness, updateBrightness,
            blueLight, updateBlueLight,
            t, mounted
        }}>
            {children}
        </GlobalContext.Provider>
    );
}

export function useGlobal() {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }
    return context;
}
