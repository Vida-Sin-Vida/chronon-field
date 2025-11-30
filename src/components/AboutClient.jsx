'use client';

import { useEffect, useState } from 'react';
import ParticleBackground from '@/components/ParticleBackground';
import EasterEggParticle from '@/components/EasterEggParticle';
import SoundTimeline from '@/components/SoundTimeline';

export default function AboutClient({ publicationCount }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
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
                {/* Header */}
                <div className="mb-16 relative inline-block">
                    <h1 className="text-sm md:text-base font-sans font-bold tracking-[0.25em] text-foreground/80 uppercase mb-3 drop-shadow-sm">
                        À propos
                    </h1>
                    <div className={`
                        h-[2px] bg-accent/40 mx-auto mt-2 transition-all duration-1000 delay-500 ease-out rounded-full
                        ${isVisible ? 'w-full opacity-100' : 'w-0 opacity-0'}
                    `}></div>

                    {/* Subtle glow behind title - Pulsing */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-accent/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
                </div>

                {/* Name */}
                <h2 className={`
                    text-4xl md:text-5xl font-serif text-foreground mb-14 tracking-wide drop-shadow-md
                    transition-all duration-1000 delay-300 ease-out
                    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                `}>
                    Benjamin Brécheteau
                </h2>

                {/* Text Content */}
                <div className={`
                    space-y-10 text-lg md:text-xl text-foreground/90 font-light leading-relaxed
                    transition-all duration-1000 delay-500 ease-out
                    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
                `}>
                    <p className="drop-shadow-sm">
                        J’ai toujours été fasciné par ce que les autres ne regardent pas :<br />
                        <span className="font-normal text-foreground">les détails, les failles, les structures cachées.</span>
                    </p>

                    <p className="drop-shadow-sm">
                        J’ai étudié plusieurs disciplines pour comprendre ce qui fait tenir le monde debout — et ce qui, parfois, le fait vaciller.<br />
                        Je ne suis pas un grand bavard, mais j’ai besoin de transmettre.
                    </p>

                    <p className="drop-shadow-sm">
                        Je travaille sur le temps, sur la cohérence, sur la manière dont les idées se tissent entre elles…<br />
                        Et je travaille aussi sur moi : apprendre à faire confiance, à lâcher prise, à accepter l’erreur.
                    </p>

                    <div className="pt-6">
                        <p className="font-medium text-foreground text-xl md:text-2xl italic font-serif opacity-90 drop-shadow-md animate-subtle-breathe">
                            "Ce site n’est pas une vitrine.<br />
                            C’est un lieu où je dépose ce que je pense vraiment."
                        </p>
                    </div>

                    <p className="pt-10 text-sm md:text-base text-accent font-semibold tracking-wide opacity-90 flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                        Publications disponibles sur le site : {publicationCount}
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
