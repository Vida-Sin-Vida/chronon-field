'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [language, setLanguage] = useState('fr'); // Default to French
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Persist language preference if needed, or detect browser lang
        const savedLang = localStorage.getItem('language');
        if (savedLang && (savedLang === 'fr' || savedLang === 'en')) {
            setLanguage(savedLang);
        }
    }, []);

    const toggleLanguage = () => {
        const newLang = language === 'fr' ? 'en' : 'fr';
        setLanguage(newLang);
        localStorage.setItem('language', newLang);
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <GlobalContext.Provider value={{
            isModalOpen,
            setIsModalOpen,
            isNavbarVisible,
            setIsNavbarVisible,
            language,
            setLanguage,
            toggleLanguage,
            t,
            mounted
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
