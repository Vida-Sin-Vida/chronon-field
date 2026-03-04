'use client';

import { useState, useEffect } from 'react';
import { useGlobal } from '../context/GlobalContext';
import useSoundEffects from '../hooks/useSoundEffects';

export default function SeriesModal({ series, initialIndex, onClose }) {
    const { t } = useGlobal();
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationClass, setAnimationClass] = useState('animate-fade-in');
    const [isClosing, setIsClosing] = useState(false);
    const { playSymbolClick } = useSoundEffects();

    useEffect(() => {
        // Prevent scrolling behind modal
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleNext = (e) => {
        if (e) e.stopPropagation();
        if (isAnimating) return;
        playSymbolClick();

        // Smooth current left out
        setAnimationClass('animate-smooth-slide-left-out');
        setIsAnimating(true);

        setTimeout(() => {
            const nextIndex = (currentIndex + 1) % series.length;
            setCurrentIndex(nextIndex);

            // Smooth new right in
            setAnimationClass('animate-smooth-slide-right-in');
            setTimeout(() => {
                setAnimationClass(''); // settled
                setIsAnimating(false);
            }, 400);
        }, 350);
    };

    const handlePrev = (e) => {
        if (e) e.stopPropagation();
        if (isAnimating) return;
        playSymbolClick();

        // Smooth current right out
        setAnimationClass('animate-smooth-slide-right-out');
        setIsAnimating(true);

        setTimeout(() => {
            const prevIndex = (currentIndex - 1 + series.length) % series.length;
            setCurrentIndex(prevIndex);

            // Smooth new left in
            setAnimationClass('animate-smooth-slide-left-in');
            setTimeout(() => {
                setAnimationClass(''); // settled
                setIsAnimating(false);
            }, 400);
        }, 350);
    };

    const handleClose = (e) => {
        if (e) e.stopPropagation();
        if (isClosing) return;

        playSymbolClick();
        setIsClosing(true);
        setAnimationClass('animate-distortion-slide-up-out');

        setTimeout(() => {
            onClose();
        }, 550);
    };

    const currentSeries = series[currentIndex];

    if (!currentSeries) return null;

    return (
        <div
            className={`fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8 ${isClosing ? 'pointer-events-none' : ''}`}
        >
            {/* Desktop Backdrop Close (Hidden on mobile to use specific top-zone only) */}
            <div
                className="absolute inset-0 z-[100] hidden md:block"
                onClick={handleClose}
            />

            {/* Mobile Top Close Zone (Only top 30% of screen triggers close on mobile) */}
            <div
                className="absolute inset-x-0 top-0 h-[35vh] z-[120] md:hidden cursor-pointer active:bg-white/5 transition-colors"
                style={{ WebkitTapHighlightColor: 'transparent' }}
                onClick={handleClose}
            />

            {/* Top "Retour" button (Mobile only) */}
            <div className="absolute top-10 left-0 right-0 flex justify-center md:hidden z-[130]">
                <button
                    onClick={handleClose}
                    className="flex items-center gap-3 px-8 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white font-serif text-sm tracking-widest hover:bg-white/15 transition-all active:scale-95 shadow-xl"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                        <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                    {t('back')}
                </button>
            </div>

            {/* Navigation Left Overlay (Full height area - Desktop) */}
            <div
                onClick={handlePrev}
                className="absolute left-0 inset-y-0 w-[15%] md:w-[25%] lg:w-[33%] z-[115] cursor-pointer group flex items-center justify-center transition-all duration-500 hidden md:flex"
                aria-label="Previous series"
            >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-4 group-hover:translate-x-0">
                    <div className="bg-white/5 backdrop-blur-md p-4 rounded-full border border-white/10 text-white/50 group-hover:text-white transition-colors text-white">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Main Content Area (Windowed Box) */}
            <div
                className={`bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative z-[111] border border-gray-100 max-h-[80vh] overflow-y-auto ${animationClass}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button (Desktop Only) */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-accent transition-colors p-2 z-20 hidden md:block"
                    aria-label="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="w-24 h-24 md:w-32 md:h-32 mx-auto relative mb-6">
                    <img src={currentSeries.image} alt="" className="w-full h-full object-contain" />
                </div>
                <div className="text-center space-y-4">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                        {currentSeries.title}
                    </h2>
                    <p className="text-base text-secondary/90 leading-relaxed font-light">
                        {currentSeries.desc}
                    </p>
                </div>
            </div>

            {/* Bottom Navigation (Mobile only) */}
            <div className="absolute inset-x-0 bottom-0 h-40 flex md:hidden z-[120]">
                {/* Hidden Left Zone */}
                <div
                    onClick={handlePrev}
                    className="flex-1 flex items-end justify-center pb-10 select-none outline-none"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                    <div className="bg-white/10 backdrop-blur-md p-5 rounded-full border border-white/20 text-white shadow-xl active:scale-90 transition-transform">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </div>
                </div>
                {/* Hidden Right Zone */}
                <div
                    onClick={handleNext}
                    className="flex-1 flex items-end justify-center pb-10 select-none outline-none"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                    <div className="bg-white/10 backdrop-blur-md p-5 rounded-full border border-white/20 text-white shadow-xl active:scale-90 transition-transform">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Navigation Right Overlay (Full height area - Desktop) */}
            <div
                onClick={handleNext}
                className="absolute right-0 inset-y-0 w-[15%] md:w-[25%] lg:w-[33%] z-[115] cursor-pointer group flex items-center justify-center transition-all duration-500 hidden md:flex"
                aria-label="Next series"
            >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-4 group-hover:translate-x-0">
                    <div className="bg-white/5 backdrop-blur-md p-4 rounded-full border border-white/10 text-white/50 group-hover:text-white transition-colors text-white">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
