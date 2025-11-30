'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { timelineData } from '../data/timeline';

export default function SoundTimeline() {
    const [activeId, setActiveId] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const containerRef = useRef(null);
    const audioRef = useRef(null);

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        // Initial size
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Audio handling
    const playAudio = (path, id) => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        // Fallback tone generator if file missing (simulated)
        // In a real app, we'd try to load the file, and onError play the tone.
        // For this demo, we'll try to play the file, and if it fails (likely), we play a tone.

        const audio = new Audio(path);
        audioRef.current = audio;
        audio.volume = 0.4;

        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Fallback: Synth tone
                playSynthTone(id);
            });
        }
    };

    const playSynthTone = (id) => {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Pentatonic scale-ish frequencies based on ID
        const baseFreq = 220;
        const freq = baseFreq * Math.pow(1.059, id * 2); // Whole tone steps roughly

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

        osc.connect(gain);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
    };

    const handlePointClick = (item) => {
        setActiveId(item.id);
        playAudio(item.audioPath, item.id);
    };

    // Generate Waveform Path
    const waveformPath = useMemo(() => {
        if (containerWidth === 0 || timelineData.length === 0) return '';

        // Calculate points
        // We want points distributed evenly along the width
        // Padding on sides: 20px
        const padding = 20;
        const availableWidth = containerWidth - (padding * 2);
        const step = availableWidth / (timelineData.length - 1);

        let path = `M ${padding} 50`; // Start middle-ish (height 100px assumed)

        // Generate a smooth curve through points
        // Simple approach: Line to each point, but with a curve
        // Or better: A sine wave that passes through the points?
        // Let's do a cubic bezier connecting points to look like a "waveform"

        for (let i = 0; i < timelineData.length - 1; i++) {
            const x1 = padding + (i * step);
            const y1 = 50;
            const x2 = padding + ((i + 1) * step);
            const y2 = 50;

            // Control points for a wave
            // We alternate up and down for the "wave" effect between points
            const midX = (x1 + x2) / 2;
            const amp = 15; // Amplitude
            const direction = i % 2 === 0 ? 1 : -1;

            // Bezier: M x1 y1 Q midX (y1 + amp*dir) x2 y2
            // Or C for smoother
            path += ` Q ${midX} ${y1 + (amp * direction)} ${x2} ${y2}`;
        }

        return path;
    }, [containerWidth]);

    return (
        <div className="py-8 w-full" ref={containerRef}>
            <h3 className="text-xl font-serif font-bold text-foreground mb-8 flex items-center gap-2">
                <span>Chronologie Sonore</span>
                <span className="text-xs font-normal text-secondary/60 bg-secondary/10 px-2 py-0.5 rounded-full">
                    Interactive
                </span>
            </h3>

            <div className="relative h-32 w-full select-none">
                {/* Waveform SVG */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible">
                    <defs>
                        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(56,189,248,0.1)" />
                            <stop offset="50%" stopColor="rgba(56,189,248,0.4)" />
                            <stop offset="100%" stopColor="rgba(56,189,248,0.1)" />
                        </linearGradient>
                    </defs>
                    {/* Shadow path */}
                    <path
                        d={waveformPath}
                        fill="none"
                        stroke="rgba(0,0,0,0.05)"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    {/* Main path */}
                    <path
                        d={waveformPath}
                        fill="none"
                        stroke="url(#waveGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="animate-pulse-slow"
                    />
                </svg>

                {/* Points */}
                <div className="absolute top-0 left-0 w-full h-full z-10">
                    {timelineData.map((item, index) => {
                        // Calculate position same as SVG
                        const padding = 20;
                        const availableWidth = containerWidth - (padding * 2);
                        const step = timelineData.length > 1 ? availableWidth / (timelineData.length - 1) : 0;
                        const left = padding + (index * step);

                        const isActive = activeId === item.id;
                        const isHoveredPoint = hoveredId === item.id;

                        return (
                            <div
                                key={item.id}
                                className="absolute top-[50px] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
                                style={{ left: `${left}px` }}
                                onMouseEnter={() => setHoveredId(item.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                onClick={() => handlePointClick(item)}
                                role="button"
                                tabIndex="0"
                                aria-label={`${item.title} (${item.year})`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handlePointClick(item);
                                    }
                                }}
                            >
                                {/* Dot */}
                                <div
                                    className={`
                                        w-3 h-3 rounded-full border-2 transition-all duration-300 relative
                                        ${isActive ? 'bg-accent border-accent scale-125 shadow-[0_0_10px_rgba(56,189,248,0.6)]' : 'bg-white border-secondary/40 hover:border-accent hover:scale-110'}
                                    `}
                                >
                                    {/* Pulse ring when active */}
                                    {isActive && (
                                        <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-75"></div>
                                    )}
                                </div>

                                {/* Label (Year) - Always visible or on hover? "étiquette courte (titre + année) sous le point" */}
                                <div className={`
                                    mt-3 text-xs font-bold transition-colors duration-300
                                    ${isActive || isHoveredPoint ? 'text-accent' : 'text-secondary/60'}
                                `}>
                                    {item.year}
                                </div>

                                {/* Tooltip / Card (Title + Desc) */}
                                <div
                                    className={`
                                        absolute bottom-full mb-3 w-40 p-3 bg-white rounded-lg shadow-lg border border-gray-100
                                        text-center transition-all duration-300 pointer-events-none z-20
                                        ${(isActive || isHoveredPoint) ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'}
                                    `}
                                >
                                    <div className="text-xs font-bold text-foreground mb-1">{item.title}</div>
                                    <div className="text-[10px] text-secondary leading-tight">{item.description}</div>
                                    {/* Arrow */}
                                    <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-gray-100"></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <p className="text-xs text-secondary/50 mt-2 text-center italic">
                Cliquez pour écouter les archives du futur.
            </p>
        </div>
    );
}
