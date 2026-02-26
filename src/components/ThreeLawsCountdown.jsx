'use client';

import { useState, useEffect } from 'react';

const LAW_DATES = {
    hypostasis: new Date('2030-01-01T00:00:00'),
};

const CountdownRow = ({ label, targetDate, transparency = 100, isPrimary = false, isSecondary = false, hasTimer = true }) => {
    const [timeLeft, setTimeLeft] = useState({
        years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0
    });

    useEffect(() => {
        if (!hasTimer) return;

        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();
            if (difference > 0) {
                setTimeLeft({
                    years: Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25)),
                    months: Math.floor((difference / (1000 * 60 * 60 * 24 * 30.44)) % 12),
                    days: Math.floor((difference / (1000 * 60 * 60 * 24)) % 30.44),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [targetDate, hasTimer]);

    const opacityClass = transparency === 100 ? 'opacity-100' : transparency === 75 ? 'opacity-75' : 'opacity-[45%]';
    const sizeClass = isPrimary ? 'text-4xl md:text-6xl' : isSecondary ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl';
    const labelSizeClass = isPrimary ? 'text-lg md:text-xl' : isSecondary ? 'text-sm md:text-base' : 'text-xs md:text-sm';

    return (
        <div className={`flex flex-col items-center ${opacityClass} ${isPrimary ? 'mb-16' : 'mb-8'}`}>
            <span className={`font-serif uppercase tracking-[0.3em] mb-4 ${labelSizeClass} ${isPrimary ? 'text-accent font-bold' : 'text-secondary/80'}`}>
                {label}
            </span>
            {hasTimer && (
                <div className={`font-mono flex gap-4 md:gap-8 ${sizeClass} text-foreground tabular-nums`}>
                    {[
                        { val: timeLeft.years, unit: 'ans' },
                        { val: timeLeft.months, unit: 'mois' },
                        { val: timeLeft.days, unit: 'jours' },
                        { val: timeLeft.hours, unit: 'h' },
                        { val: timeLeft.minutes, unit: 'm' },
                        { val: timeLeft.seconds, unit: 's' },
                    ].map(({ val, unit }) => (
                        <div key={unit} className="flex flex-col items-center">
                            <span>{String(val).padStart(2, '0')}</span>
                            <span className="text-[10px] uppercase font-sans tracking-widest mt-1 opacity-50">{unit}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function ThreeLawsCountdown({ onClose }) {
    const [phase, setPhase] = useState('entering'); // 'entering' | 'visible' | 'exiting-btn' | 'exiting'

    useEffect(() => {
        // Transition from entering to visible after animation
        const t = setTimeout(() => setPhase('visible'), 50);
        return () => clearTimeout(t);
    }, []);

    const handleClose = () => {
        // 1. Animate button sliding down
        setPhase('exiting-btn');
        setTimeout(() => {
            // 2. Distort the whole panel
            setPhase('exiting');
            setTimeout(() => {
                // 3. Call the parent close handler
                onClose();
            }, 750);
        }, 350);
    };

    const panelClass = phase === 'entering'
        ? 'opacity-0 translate-x-[120px] blur-[20px]'
        : phase === 'visible' || phase === 'exiting-btn'
            ? 'animate-fog-in-right'
            : 'animate-distortion-out';

    return (
        <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center p-6`}>
            {/* No background overlay — particles stay fully visible */}

            <div className={`w-full max-w-4xl flex flex-col items-center transition-all ${panelClass}`}>
                <CountdownRow
                    label="Law I — Hypostasis"
                    targetDate={LAW_DATES.hypostasis}
                    isPrimary={true}
                    hasTimer={true}
                />
                <CountdownRow
                    label="Law II — Palmōsis"
                    targetDate={LAW_DATES.hypostasis}
                    transparency={75}
                    isSecondary={true}
                    hasTimer={false}
                />
                <CountdownRow
                    label="Law III — Aletheia"
                    targetDate={LAW_DATES.hypostasis}
                    transparency={45}
                    hasTimer={false}
                />
            </div>

            <button
                onClick={handleClose}
                className={`mt-12 group flex flex-col items-center transition-all duration-500 hover:scale-110 ${phase === 'exiting-btn' || phase === 'exiting' ? 'animate-slide-down-fast' : ''}`}
            >
                <div className="bg-background/40 backdrop-blur-md p-4 rounded-full border border-accent/20 shadow-2xl group-hover:border-accent/50 transition-colors mb-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                </div>
                <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold opacity-70 group-hover:opacity-100">Accueil</span>
            </button>
        </div>
    );
}
