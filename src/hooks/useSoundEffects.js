'use client';

import { useRef, useEffect, useCallback } from 'react';

export default function useSoundEffects() {
    const audioCtxRef = useRef(null);
    const tickingIntervalRef = useRef(null);

    // Initialize AudioContext
    const getAudioContext = useCallback(() => {
        if (typeof window === 'undefined') return null;
        if (!audioCtxRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtxRef.current = new AudioContext();
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
        return audioCtxRef.current;
    }, []);

    // Utility to play extremely short, soft, minimal micro-sounds
    const playMicroTone = useCallback((ctx, frequency, type, startTime, duration = 0.05, peakGain = 0.02) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, startTime);

        gainNode.gain.setValueAtTime(0, startTime);
        // Extremely fast attack
        gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.01);
        // Fast decay to silence
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
    }, []);

    // 1. Page Transition (A very brief, almost imperceptible "woosh" / tap)
    const playPageTransition = useCallback(() => {
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    }, [getAudioContext]);

    // 2. Header Logo Click (Tiny glass tick, 30ms)
    const playHeaderClick = useCallback(() => {
        const ctx = getAudioContext();
        if (!ctx) return;
        playMicroTone(ctx, 1500, 'sine', ctx.currentTime, 0.03, 0.015);
    }, [getAudioContext, playMicroTone]);

    // 3. Center Logo Click (Soft, muted tap, 60ms)
    const playCenterClick = useCallback(() => {
        const ctx = getAudioContext();
        if (!ctx) return;
        playMicroTone(ctx, 200, 'sine', ctx.currentTime, 0.08, 0.03);
    }, [getAudioContext, playMicroTone]);

    // 4. Symbol Click (Light wooden tap, 40ms)
    const playSymbolClick = useCallback(() => {
        const ctx = getAudioContext();
        if (!ctx) return;
        playMicroTone(ctx, 800, 'sine', ctx.currentTime, 0.04, 0.015);
        playMicroTone(ctx, 1200, 'sine', ctx.currentTime + 0.01, 0.03, 0.01);
    }, [getAudioContext, playMicroTone]);

    // 5. Three Laws Ticking (Subliminal, deep thud every second)
    const startTicking = useCallback(() => {
        const ctx = getAudioContext();
        if (!ctx) return;

        if (tickingIntervalRef.current) {
            clearInterval(tickingIntervalRef.current);
        }

        const tick = () => {
            if (ctx.state === 'suspended') return;

            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(50, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.05);

            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.015, now + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.06);
        };

        tick();
        tickingIntervalRef.current = setInterval(tick, 1000);
    }, [getAudioContext]);

    const stopTicking = useCallback(() => {
        if (tickingIntervalRef.current) {
            clearInterval(tickingIntervalRef.current);
            tickingIntervalRef.current = null;
        }
    }, []);

    // 6. Email Sent (Extremely quick confirm blip)
    const playEmailSent = useCallback(() => {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        // Fast, two-note bright ping
        playMicroTone(ctx, 600, 'sine', now, 0.08, 0.02);
        playMicroTone(ctx, 800, 'sine', now + 0.06, 0.1, 0.02);
    }, [getAudioContext, playMicroTone]);

    useEffect(() => {
        return () => stopTicking();
    }, [stopTicking]);

    return {
        playPageTransition,
        playHeaderClick,
        playCenterClick,
        playSymbolClick,
        startTicking,
        stopTicking,
        playEmailSent
    };
}
