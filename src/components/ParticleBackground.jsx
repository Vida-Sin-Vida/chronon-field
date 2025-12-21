'use client';

import { useEffect, useRef } from 'react';

class Particle {
    constructor(canvas, color) {
        this.canvas = canvas;
        this.color = color || [11, 34, 64]; // Default #0B2240
        const dpr = window.devicePixelRatio || 1;
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;

        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1; // 1-3px
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Use logical coordinates (divided by DPR is handled by scale on draw, but boundaries need care)
        // Actually, easier to keep logic in logical coords and canvas in physical
        // Wait, if we scale ctx, we draw in logical coords.
        // So boundaries should be logical width/height.

        const dpr = window.devicePixelRatio || 1;
        const width = this.canvas.width / dpr;
        const height = this.canvas.height / dpr;

        if (this.x > width) this.x = 0;
        if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        if (this.y < 0) this.y = height;
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

export default function ParticleBackground({ className, color }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            if (parent) {
                // Use getBoundingClientRect for precise pixel values
                const rect = parent.getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;

                // Set actual canvas size (accounting for DPR)
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;

                // Scale context to match DPR
                ctx.scale(dpr, dpr);

                // Set display size via CSS
                canvas.style.width = `${rect.width}px`;
                canvas.style.height = `${rect.height}px`;
            } else {
                const dpr = window.devicePixelRatio || 1;
                canvas.width = window.innerWidth * dpr;
                canvas.height = window.innerHeight * dpr;
                ctx.scale(dpr, dpr);
                canvas.style.width = `${window.innerWidth}px`;
                canvas.style.height = `${window.innerHeight}px`;
            }
        };

        // Initial resize
        resizeCanvas();

        // Use ResizeObserver for more robust resizing (especially in modals)
        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
        });

        if (canvas.parentElement) {
            resizeObserver.observe(canvas.parentElement);
        } else {
            window.addEventListener('resize', resizeCanvas);
        }

        const init = () => {
            particles = [];
            // Calculate effective area for density
            const width = canvas.width / (window.devicePixelRatio || 1);
            const height = canvas.height / (window.devicePixelRatio || 1);
            const numberOfParticles = Math.floor((width * height) / 10000); // Density

            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle(canvas, color));
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((particle) => {
                particle.update();
                particle.draw(ctx);
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            resizeObserver.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, [color]);

    return (
        <canvas
            ref={canvasRef}
            className={className || "fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"}
        />
    );
}
