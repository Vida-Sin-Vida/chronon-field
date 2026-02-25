'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobal } from '../../context/GlobalContext';

// The old isolated ParticleWave component has been removed as we now trigger the main ParticleBackground waves

export default function Contact() {
    const { t } = useGlobal();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        type: 'collaboration',
        subject: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

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
        playSuccessSound();

        // Dispatch an event to the ParticleBackground to trigger 4 waves of decreasing intensity
        const btnRect = e.target.querySelector('button[type="submit"]').getBoundingClientRect();
        const waveX = btnRect.left + btnRect.width / 2;
        const waveY = btnRect.top + btnRect.height / 2;

        const event = new CustomEvent('trigger-chronon-wave', {
            detail: {
                x: waveX,
                y: waveY,
                intensities: [1.5, 1.1, 0.7, 0.4] // 4 waves decreasing in magnitude
            }
        });
        window.dispatchEvent(event);

        // Simulate delay before redirecting/resetting to allow animation to play
        setTimeout(() => {
            // Mailto fallback
            // Get the translated label for the selected type to send in the email, or just use the key if preferred. 
            // Ideally we want the readable string like [COLLABORATION].
            // Mapping value to uppercase key for the subject tag.
            const typeTag = formData.type.toUpperCase();

            const subject = encodeURIComponent(`[${typeTag}] [Chronon Field] ${formData.subject}`);
            const body = encodeURIComponent(`Nom: ${formData.name}\nEmail: ${formData.email}\nType: ${formData.type}\n\nMessage:\n${formData.message}`);
            window.location.href = `mailto:Brecheteaub@gmail.com?subject=${subject}&body=${body}`;

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
            <div className="container mx-auto px-6 py-12 max-w-2xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-8 text-center">
                        {t('contact_title')}
                    </h1>
                    <p className="text-secondary text-center mb-12">
                        {t('contact_desc')}
                    </p>

                    <div className="flex justify-center mb-12">
                        <a
                            href="https://www.linkedin.com/company/brecheteau-research-institut/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-6 py-3 bg-white/50 border border-gray-200 rounded-lg shadow-sm hover:bg-white/80 hover:border-accent/40 hover:shadow-md transition-all duration-300 text-foreground font-medium group"
                        >
                            <svg className="w-5 h-5 mr-3 text-black group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                            {t('contact_linkedin')}
                        </a>
                    </div>

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
                                            {t('contact_name')}
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
                                            {t('contact_email')}
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
                                        <label htmlFor="type" className="block text-sm font-medium text-foreground mb-2">
                                            {t('contact_type')}
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="type"
                                                name="type"
                                                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all appearance-none cursor-pointer"
                                                value={formData.type}
                                                onChange={handleChange}
                                            >
                                                <option value="collaboration">{t('contact_type_collaboration')}</option>
                                                <option value="exchange">{t('contact_type_exchange')}</option>
                                                <option value="info">{t('contact_type_info')}</option>
                                                <option value="publish">{t('contact_type_publish')}</option>
                                                <option value="other">{t('contact_type_other')}</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                                            {t('contact_subject')}
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
                                            {t('contact_message')}
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
                                        {t('contact_send')}
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
                                    <h2 className="text-3xl font-serif font-bold text-foreground mb-4">{t('contact_success_title')}</h2>
                                    <p className="text-secondary text-lg">
                                        {t('contact_success_desc')}
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
