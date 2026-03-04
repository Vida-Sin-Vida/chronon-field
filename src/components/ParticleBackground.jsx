'use client';

import { useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   Chronon Field Background — Φ(x, y, t)
   ─────────────────────────────────────────────────────────────────────────────
   Philosophy:
     • The field does NOT scroll, drift, or blow like smoke.
     • Every dot sits on a coherent lattice; only its luminance, slight radial
       displacement and phase breathe — according to a smooth local tempo Φ.
     • Three semi-transparent layers share the same principle but run at
       slightly different tempos, creating a perception of temporal stratification.
     • Mouse proximity reveals local anisotropy: nearby dots brighten just
       enough to expose the field's underlying structure — no cursor trail.
     • Palette: near-black background, cold blue-grey dots, very contained halos.
   ──────────────────────────────────────────────────────────────────────────── */

// ── Smooth noise (value noise, 2-D, C¹) ──────────────────────────────────────
// We bake a random gradient table once and interpolate with quintic fade.

const NOISE_TABLE_SIZE = 256;
const noiseP = new Uint8Array(NOISE_TABLE_SIZE * 2);
const noiseG = new Float32Array(NOISE_TABLE_SIZE * 2);

(function buildNoise() {
    const perm = Array.from({ length: NOISE_TABLE_SIZE }, (_, i) => i);
    for (let i = NOISE_TABLE_SIZE - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [perm[i], perm[j]] = [perm[j], perm[i]];
    }
    for (let i = 0; i < NOISE_TABLE_SIZE * 2; i++) {
        noiseP[i] = perm[i % NOISE_TABLE_SIZE];
        noiseG[i] = Math.random() * 2 - 1; // random value in [-1, 1]
    }
})();

function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a, b, t) { return a + t * (b - a); }

function noise2(x, y) {
    const xi = Math.floor(x) & (NOISE_TABLE_SIZE - 1);
    const yi = Math.floor(y) & (NOISE_TABLE_SIZE - 1);
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const aa = noiseP[noiseP[xi] + yi];
    const ab = noiseP[noiseP[xi] + yi + 1];
    const ba = noiseP[noiseP[xi + 1] + yi];
    const bb = noiseP[noiseP[xi + 1] + yi + 1];

    const u = fade(xf);
    const v = fade(yf);

    return lerp(
        lerp(noiseG[aa], noiseG[ba], u),
        lerp(noiseG[ab], noiseG[bb], u),
        v
    );
}

// Fractional Brownian Motion — 2 octaves for broad, smooth modulation
function fbm(x, y) {
    return noise2(x, y) * 0.65 + noise2(x * 2.1, y * 2.1) * 0.35;
}

// ── Layer definition ──────────────────────────────────────────────────────────
// Each layer has a specific cadence and spatial mapping. Noise scale is very low to create wide coherent zones.
const LAYERS = [
    { spacing: 32, tempoMul: 1.40, baseOpacity: 0.55, noiseScale: 0.002, dotRadius: 0.8, phaseOffset: 0.00 },
    { spacing: 48, tempoMul: 1.25, baseOpacity: 0.35, noiseScale: 0.0015, dotRadius: 1.1, phaseOffset: 2.09 }, // +2π/3
    { spacing: 64, tempoMul: 1.60, baseOpacity: 0.22, noiseScale: 0.003, dotRadius: 1.4, phaseOffset: 4.19 }, // +4π/3
];

// ── Colour ────────────────────────────────────────────────────────────────────
// Dots oscillate between two cold colours based on local phase.
// For a light background, we need darker dots so they are visible.
const COLOR_LOW = [11, 34, 64]; // #0B2240 (foreground color in css)
const COLOR_HIGH = [80, 100, 130]; // Lighter dark blue

function lerpColor(t) {
    return [
        (COLOR_LOW[0] + t * (COLOR_HIGH[0] - COLOR_LOW[0])) | 0,
        (COLOR_LOW[1] + t * (COLOR_HIGH[1] - COLOR_LOW[1])) | 0,
        (COLOR_LOW[2] + t * (COLOR_HIGH[2] - COLOR_LOW[2])) | 0,
    ];
}

// ── Mouse influence ───────────────────────────────────────────────────────────
const MOUSE_INFLUENCE_RADIUS = 160; // px  — only nearby dots are affected
const MOUSE_BOOST = 0.12; // extra opacity at radius 0 (made lighter)

export default function ParticleBackground({ className, isPlaying = false }) {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: -9999, y: -9999 }); // off-screen by default
    const isPlayingRef = useRef(isPlaying);

    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let raf;
        let startTime = performance.now();
        let lastMouseMoveTime = 0;
        let waves = [];
        let lastWaveTime = 0;

        let cachedFields = []; // Precomputed lattice per layer

        // ── Resize handler & Field Initialization ─────────────────────────────────
        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const w = window.innerWidth;
            const h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.scale(dpr, dpr);

            const W = w;
            const H = h;

            // Precompute the static field properties for all layers
            cachedFields = LAYERS.map((layer, index) => {
                const { spacing, noiseScale } = layer;
                const offsetX = (spacing / 2) * (index % 2);
                const offsetY = (spacing / 3) * (index % 2);

                const cols = Math.ceil(W / spacing) + 1;
                const rows = Math.ceil(H / spacing) + 1;
                const dots = [];

                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        const px = col * spacing + offsetX;
                        const py = row * spacing + offsetY;

                        // Static math precomputed once per resize
                        const phi = fbm(px * noiseScale, py * noiseScale); // in [-1, 1]
                        const staticAngle = fbm(px * noiseScale * 2.5, py * noiseScale * 2.5) * Math.PI * 2;
                        const staticDisp = Math.abs(fbm(px * noiseScale * 1.5 + 500, py * noiseScale * 1.5 + 500)) * (spacing * 0.35);

                        dots.push({ px, py, phi, staticAngle, staticDisp });
                    }
                }
                return { layer, dots };
            });
        };

        // Debounce resize to prevent layout thrashing
        let resizeTimeout;
        const onResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resize, 100);
        };

        resize();
        window.addEventListener('resize', onResize);

        // ── Mouse tracking ────────────────────────────────────────────────────────
        const onMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
            lastMouseMoveTime = performance.now();
        };
        const onMouseLeave = () => {
            mouseRef.current = { x: -9999, y: -9999 };
        };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseleave', onMouseLeave);

        // ── Main render loop ──────────────────────────────────────────────────────
        const draw = (now) => {
            const t = (now - startTime) * 0.001; // seconds, global clock
            const timeSinceLastMove = now - lastMouseMoveTime;
            const mouseActiveFactor = Math.max(0, 1 - timeSinceLastMove / 1000); // Fades out over 1s after stopping

            const W = canvas.width / (window.devicePixelRatio || 1);
            const H = canvas.height / (window.devicePixelRatio || 1);
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            // Generate heartbeat waves
            if (isPlayingRef.current) {
                if (now - lastWaveTime >= 1000) {
                    let waveX = W / 2;
                    let waveY = H / 2;

                    // Try to find the quote text element to start wave from its center
                    const quoteEl = document.getElementById('quote-text');
                    if (quoteEl) {
                        const rect = quoteEl.getBoundingClientRect();
                        waveX = rect.left + rect.width / 2;
                        waveY = rect.top + rect.height / 2;
                    }

                    waves.push({ x: waveX, y: waveY, startTime: now, intensityMult: 1.0 });
                    lastWaveTime = now;
                }
            }

            // Cleanup old waves
            waves = waves.filter(w => now - w.startTime < 6000);

            // Clear with deep background
            ctx.fillStyle = '#F7F6F3';
            ctx.fillRect(0, 0, W, H);

            // ── Render each layer ─────────────────────────────────────────────────
            for (const field of cachedFields) {
                const { layer, dots } = field;
                const { tempoMul, baseOpacity, dotRadius, phaseOffset } = layer;

                for (let i = 0; i < dots.length; i++) {
                    const dot = dots[i];
                    const { px, py, phi, staticAngle, staticDisp } = dot;

                    // Local breathing: φ(x,y,t) = sin( t * tempo * (1 + 0.35*Φ) + phaseOffset + Φ*π )
                    const localTempo = tempoMul * (1 + 0.35 * phi);
                    const phase = Math.sin(t * localTempo + phaseOffset + phi * Math.PI);

                    // phase in [-1,1] → normalized [0,1] for colour & opacity
                    const norm = (phase + 1) * 0.5;

                    // Mouse influence
                    const dx = px - mx;
                    const dy = py - my;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    let mouseFactor = 0;
                    if (dist < MOUSE_INFLUENCE_RADIUS) {
                        mouseFactor = MOUSE_BOOST * (1 - dist / MOUSE_INFLUENCE_RADIUS) * (0.5 + 0.5 * Math.abs(phi));
                    }
                    mouseFactor *= mouseActiveFactor;

                    // Wave influence
                    let waveBoost = 0;
                    for (let wIdx = 0; wIdx < waves.length; wIdx++) {
                        const w = waves[wIdx];
                        const dxw = px - w.x;
                        const dyw = py - w.y;
                        const wd = Math.sqrt(dxw * dxw + dyw * dyw);
                        const age = (now - w.startTime) * 0.001; // seconds
                        const waveRadius = age * 500; // slower speed: 500px/s

                        const distToWave = Math.abs(wd - waveRadius);
                        const waveThickness = 120;
                        if (distToWave < waveThickness) {
                            const intensity = Math.pow(1 - distToWave / waveThickness, 2);
                            const fade = Math.max(0, 1 - age * 0.25); // age / 4
                            const currentBoost = intensity * fade * 0.85 * (w.intensityMult || 1.0);
                            if (currentBoost > waveBoost) waveBoost = currentBoost;
                        }
                    }

                    const finalBoost = Math.max(mouseFactor, waveBoost);
                    const opacity = baseOpacity * (0.1 + 0.9 * norm) + finalBoost;
                    const finalOpacity = opacity > 1 ? 1 : opacity;
                    const [r, g, b] = lerpColor(norm * 0.7 + finalBoost * 1.5);

                    // Displacement
                    const pulseDisp = phase * 2.0;
                    const totalDisp = staticDisp + pulseDisp;
                    const dpx = px + totalDisp * Math.cos(staticAngle);
                    const dpy = py + totalDisp * Math.sin(staticAngle);

                    // Draw dot
                    ctx.globalAlpha = finalOpacity;
                    ctx.fillStyle = `rgb(${r},${g},${b})`;
                    ctx.beginPath();
                    ctx.arc(dpx, dpy, dotRadius, 0, Math.PI * 2);
                    ctx.fill();

                    // Micro-halo
                    if (norm > 0.50 || finalBoost > 0.05) {
                        const haloAlpha = (norm - 0.50) * 0.25 + finalBoost * 0.35;
                        const finalHaloAlpha = haloAlpha > 0.25 ? 0.25 : haloAlpha;
                        const haloRadius = dotRadius * 4.0;

                        ctx.globalAlpha = finalHaloAlpha;
                        const grad = ctx.createRadialGradient(dpx, dpy, 0, dpx, dpy, haloRadius);
                        grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
                        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
                        ctx.fillStyle = grad;

                        ctx.beginPath();
                        ctx.arc(dpx, dpy, haloRadius, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }

            ctx.globalAlpha = 1;
            raf = requestAnimationFrame(draw);
        };

        const handleCustomWave = (e) => {
            const { x, y, intensities } = e.detail || {};
            const pxX = x !== undefined ? x : window.innerWidth / 2;
            const pxY = y !== undefined ? y : window.innerHeight / 2;

            // Generate multiple cascading waves if intensities array is provided
            if (Array.isArray(intensities)) {
                intensities.forEach((mult, index) => {
                    setTimeout(() => {
                        waves.push({ x: pxX, y: pxY, startTime: performance.now(), intensityMult: mult });
                    }, index * 800); // 800ms between each wave cascade
                });
            } else {
                waves.push({ x: pxX, y: pxY, startTime: performance.now(), intensityMult: 1.0 });
            }
        };

        window.addEventListener('trigger-chronon-wave', handleCustomWave);
        raf = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseleave', onMouseLeave);
            window.removeEventListener('trigger-chronon-wave', handleCustomWave);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={className || 'fixed top-0 left-0 w-full h-full -z-10 pointer-events-none'}
        />
    );
}

/*
  Φ(x, y, t) — Chronon Field Background
  Each point breathes at its own local tempo — no wind, no smoke.
  Benjamin Brécheteau | Chronon Field 2026
*/
