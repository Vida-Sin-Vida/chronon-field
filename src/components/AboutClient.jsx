'use client';

import { useEffect, useState } from 'react';
import ParticleBackground from '@/components/ParticleBackground';
import EasterEggParticle from '@/components/EasterEggParticle';
import SoundTimeline from '@/components/SoundTimeline';
import { useGlobal } from '../context/GlobalContext';

export default function AboutClient({ publicationCount }) {
    const { t } = useGlobal();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none z-0"></div>
            <ParticleBackground />

            <EasterEggParticle />

            {/* Main Content */}
            <div className={`
                relative z-10 max-w-[800px] px-8 py-20 md:py-32 text-center
                transition-opacity duration-1000 ease-out
                ${isVisible ? 'opacity-100' : 'opacity-0'}
            `}>
                {/* Header - Kept Centered */}
                <div className="mb-16 relative inline-block text-center w-full">
                    <h1 className="text-sm md:text-base font-sans font-bold tracking-[0.25em] text-foreground/80 uppercase mb-3 drop-shadow-sm">
                        {t('about_title')}
                    </h1>
                    <div className={`
                        h-[2px] bg-accent/40 mx-auto mt-2 transition-all duration-1000 delay-500 ease-out rounded-full
                        ${isVisible ? 'w-24 opacity-100' : 'w-0 opacity-0'}
                    `}></div>

                    {/* Subtle glow behind title */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-accent/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
                </div>

                {/* Name - Kept Centered */}
                <h2 className={`
                    text-4xl md:text-5xl font-serif text-foreground mb-20 tracking-wide drop-shadow-md text-center
                    transition-all duration-1000 delay-300 ease-out
                    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                `}>
                    {t('about_name')}
                </h2>

                {/* Text Content - Left Aligned for Flow */}
                <div className={`
                    space-y-12 text-lg md:text-xl text-foreground/90 font-light leading-relaxed text-left max-w-2xl mx-auto
                    transition-all duration-1000 delay-500 ease-out
                    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
                `}>
                    <p className="drop-shadow-sm">
                        {t('about_text_1')}<br />
                        <span className="font-normal text-foreground">{t('about_text_1_bold')}</span>
                    </p>

                    <p className="drop-shadow-sm">
                        {t('about_text_2')}
                    </p>

                    <p className="drop-shadow-sm">
                        {t('about_text_3')}
                    </p>

                    <p className="drop-shadow-sm">
                        {t('about_text_4')}
                    </p>

                    {/* Quote & Signature Section - Slightly Offset or Centered block */}
                    <div className="pt-16 pb-8 relative">
                        {/* Decorative line before quote */}
                        <div className="w-16 h-[1px] bg-accent/30 mb-8"></div>

                        <p className="font-medium text-foreground text-xl md:text-2xl italic font-serif opacity-90 drop-shadow-md animate-subtle-breathe pl-0 md:pl-8 border-l-2 border-accent/20">
                            {t('about_quote')}
                        </p>

                        {/* Signature - Organic positioning */}
                        <div className="flex justify-end mt-12 mr-0 md:-mr-8 opacity-80 hover:opacity-100 transition-opacity duration-500 transform rotate-[-2deg]">
                            <img
                                src="/signature_transparent.png"
                                alt="Signature Benjamin Brécheteau"
                                className="w-48 md:w-64 h-auto drop-shadow-lg"
                            />
                        </div>
                    </div>

                    <p className="pt-4 text-sm md:text-base text-accent font-semibold tracking-wide opacity-80 text-center">
                        — {t('publications_count_label')} {publicationCount}
                    </p>
                </div>
            </div>

            {/* Timeline Section - Kept discrete at the bottom */}
            <div className={`
                w-full max-w-4xl px-6 pb-20 mt-12
                transition-all duration-1000 delay-700 ease-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}>
                <div className="h-[1px] w-32 bg-secondary/30 mx-auto mb-16"></div>
                <SoundTimeline />
            </div>

            <style jsx global>{`
                @keyframes subtle-breathe {
                    0%, 100% { transform: scale(1); opacity: 0.9; }
                    50% { transform: scale(1.02); opacity: 1; }
                }
                .animate-subtle-breathe {
                    animation: subtle-breathe 6s ease-in-out infinite;
                }
                .animate-pulse-slow {
                    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
}
