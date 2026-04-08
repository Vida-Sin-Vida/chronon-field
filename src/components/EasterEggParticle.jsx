'use client';

import { useState, useEffect, useRef } from 'react';

export default function EasterEggParticle() {
    const [position, setPosition] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showText, setShowText] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        // Initialize audio object
        audioRef.current = new Audio('/assets/audio/dofus_aie.mp3');
        audioRef.current.volume = 0.5; // Moderate volume

        const isValidPosition = (x, y) => {
            if (typeof document === 'undefined') return true;

            // Get element at these coordinates
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const pxX = (x / 100) * viewportWidth;
            const pxY = (y / 100) * viewportHeight;

            const element = document.elementFromPoint(pxX, pxY);

            if (!element) return true;

            // Check if element or its parents are interactive
            const interactiveTags = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'];
            let current = element;
            while (current && current !== document.body) {
                if (interactiveTags.includes(current.tagName)) return false;
                if (current.id === 'easter-egg-particle') return true;
                current = current.parentElement;
            }

            // Avoid header area (approx top 100px)
            if (pxY < 100) return false;

            return true;
        };

        const getPosition = () => {
            let attempts = 0;
            let newPos = null;

            while (attempts < 3) {
                // Random position 5% to 95%
                const top = Math.random() * 90 + 5;
                const left = Math.random() * 90 + 5;

                if (isValidPosition(left, top)) {
                    newPos = { top: `${top}%`, left: `${left}%` };
                    break;
                }
                attempts++;
            }

            if (!newPos) {
                const top = Math.random() * 90 + 5;
                const left = Math.random() * 90 + 5;
                newPos = { top: `${top}%`, left: `${left}%` };
            }

            return newPos;
        };

        const timer = setTimeout(() => {
            setPosition(getPosition());
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    const playFallbackSound = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            // Playful "Aie!" sound simulation (pitch drop)
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.2);

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        } catch (e) {
            console.error('Audio fallback failed', e);
        }
    };

    const handleClick = () => {
        if (!isVisible || isAnimating) return;

        // Play sound
        if (audioRef.current) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    // Audio play failed, using fallback
                    playFallbackSound();
                });
            }
        } else {
            playFallbackSound();
        }

        // Show text and start animation
        setShowText(true);
        setIsAnimating(true);

        // Remove after animation
        // Text fades out over 1.2s, particle shrinks fast (380ms)
        // We wait for the text to finish before unmounting
        setTimeout(() => {
            setIsVisible(false);
        }, 1200);
    };

    if (!position || !isVisible) return null;

    const particleStyle = isAnimating
        ? { opacity: 0, transform: 'scale(0.6)', transition: 'all 380ms ease-out' }
        : { animation: 'starTwinkle 4s ease-in-out infinite' };

    return (
        <div
            id="easter-egg-particle"
            className="fixed z-0 flex items-center justify-center select-none"
            style={{ top: position.top, left: position.left }}
        >
            <div
                role="button"
                tabIndex="-1"
                aria-label="Easter egg"
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleClick();
                    }
                }}
                className={`
                    w-1 h-1 rounded-full cursor-pointer 
                    bg-gray-400 shadow-[0_0_5px_rgba(156,163,175,0.9)]
                    ${isHovered ? 'w-1.5 h-1.5 !opacity-100' : ''}
                `}
                style={particleStyle}
            ></div>

            {/* Floating Text "Aie..!" */}
            {showText && (
                <div
                    className="absolute pointer-events-none text-accent font-medium text-[14px] whitespace-nowrap drop-shadow-sm"
                    style={{
                        animation: 'floatAndFade 1.2s forwards'
                    }}
                >
                    Aie..!
                </div>
            )}

            <style jsx>{`
                @keyframes starTwinkle {
                    0%, 100% { opacity: 0.3; transform: scale(0.8); filter: brightness(0.8); }
                    20% { opacity: 0.9; transform: scale(1.2); filter: brightness(1.2) drop-shadow(0 0 8px rgba(156,163,175,0.9)); }
                    40% { opacity: 0.2; transform: scale(0.7); filter: brightness(0.7); }
                    60% { opacity: 1; transform: scale(1.4); filter: brightness(1.5) drop-shadow(0 0 12px rgba(200,200,200,1)); }
                    80% { opacity: 0.4; transform: scale(0.9); filter: brightness(0.9); }
                }
                @keyframes floatAndFade {
                    0% { opacity: 1; transform: translateY(0) scale(1); }
                    20% { opacity: 1; transform: translateY(-10px) scale(1.1); }
                    100% { opacity: 0; transform: translateY(-30px) scale(0.9); }
                }
            `}</style>
        </div>
    );
}
