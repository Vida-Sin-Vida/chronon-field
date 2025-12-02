'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        // Emit from the center of the screen
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.size = Math.random() * 3 + 1; // 1-4px

        // Radial movement
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 2 + 1; // Speed
        this.speedX = Math.cos(angle) * velocity;
        this.speedY = Math.sin(angle) * velocity;

        this.opacity = Math.random() * 0.5 + 0.2;
        // Color matching Home page: #0B2240
        this.color = `rgba(11, 34, 64, ${this.opacity})`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    isOutOfBounds() {
        return (
            this.x < -50 ||
            this.x > this.canvas.width + 50 ||
            this.y < -50 ||
            this.y > this.canvas.height + 50
        );
    }
}

const ParticleWave = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        const startTime = Date.now();

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const init = () => {
            // Create a burst of particles
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle(canvas));
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Emit particles only for the first 1.5 seconds
            if (Date.now() - startTime < 1500) {
                if (particles.length < 500) {
                    particles.push(new Particle(canvas));
                    particles.push(new Particle(canvas));
                }
            }

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw(ctx);
                if (particles[i].isOutOfBounds()) {
                    particles.splice(i, 1);
                    i--;
                }
            }

            // Continue animation if particles exist or if we are still in emission window
            if (particles.length > 0 || Date.now() - startTime < 1500) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        init();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }} // Behind the success card (which is z-10 or higher)
        />
    );
};

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showParticles, setShowParticles] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const playSuccessSound = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, ctx.currentTime); // A4
            oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // A5

            // Add a second oscillator for a "sparkle" effect
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(880, ctx.currentTime);
            osc2.frequency.linearRampToValueAtTime(1760, ctx.currentTime + 0.2);

            gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);

            gain2.gain.setValueAtTime(0.05, ctx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);

            oscillator.start();
            oscillator.stop(ctx.currentTime + 1.0);
            osc2.start();
            osc2.stop(ctx.currentTime + 1.0);
        } catch (error) {
            console.error("Audio playback failed", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        setShowParticles(true);
        playSuccessSound();

        // Simulate delay before redirecting/resetting to allow animation to play
        setTimeout(() => {
            // Mailto fallback
            const subject = encodeURIComponent(`[Chronon Field] ${formData.subject}`);
            const body = encodeURIComponent(`Nom: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
            window.location.href = `mailto:contact@chrononfield.com?subject=${subject}&body=${body}`;

            // Removed the timeout that hides particles. They will persist until they leave the screen.
        }, 1500);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
        exit: {
            opacity: 0,
            y: -50,
            x: 50,
            scale: 0.9,
            transition: { duration: 0.5, ease: "easeInOut" }
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

            {showParticles && <ParticleWave />}

            <div className="container mx-auto px-6 py-12 max-w-2xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-8 text-center">
                        Contact
                    </h1>
                    <p className="text-secondary text-center mb-12">
                        Pour toute demande de collaboration ou d&apos;information, veuillez utiliser le formulaire ci-dessous.
                    </p>

                    <div className="relative min-h-[500px]">
                        <AnimatePresence mode="wait">
                            {!isSubmitted ? (
                                <motion.form
                                    key="form"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                    exit="exit"
                                    onSubmit={handleSubmit}
                                    className="space-y-6 bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/20"
                                >
                                    <motion.div variants={itemVariants}>
                                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                                            Nom
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                                            Sujet
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            required
                                            className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                                            value={formData.subject}
                                            onChange={handleChange}
                                        />
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows="5"
                                            required
                                            className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all resize-none"
                                            value={formData.message}
                                            onChange={handleChange}
                                        ></textarea>
                                    </motion.div>

                                    <motion.button
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full py-4 bg-accent text-white font-bold rounded-lg shadow-md hover:bg-accent/90 transition-colors duration-200"
                                    >
                                        Envoyer
                                    </motion.button>
                                </motion.form>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{
                                        opacity: 1,
                                        scale: [1, 1.05, 1, 1.02, 1, 1.01, 1], // Damped pulsation
                                    }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{
                                        opacity: { duration: 0.5, type: "spring" },
                                        scale: {
                                            duration: 2.5,
                                            ease: "easeInOut",
                                            times: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1]
                                        }
                                    }}
                                    className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/20 text-center z-20"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                                    >
                                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </motion.div>
                                    <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Message envoyé !</h2>
                                    <p className="text-secondary text-lg">
                                        Merci de nous avoir contactés. Vos informations ont été transmises avec succès.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
