'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ParticleBackground from '../../components/ParticleBackground';
import Link from 'next/link';

const PdfViewer = dynamic(() => import('../../components/PdfViewer'), { ssr: false });

export default function Programme() {
    const [isPdfOpen, setIsPdfOpen] = useState(false);

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 bg-background relative selection:bg-accent/30">
            <ParticleBackground />

            <div className="container mx-auto max-w-4xl relative z-10">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-accent mb-6">
                        Programme CHRONON
                    </h1>
                    <p className="text-lg text-secondary max-w-2xl mx-auto leading-relaxed">
                        Accédez à la première version publique de notre outil de recherche et d&apos;analyse.
                    </p>
                </header>

                {/* Download Section */}
                <section className="mb-20 flex flex-col items-center">
                    <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 shadow-lg max-w-2xl w-full text-center hover:border-accent/30 transition-colors duration-300">
                        <h2 className="text-2xl font-bold text-primary mb-4">CHRONON - V1.0.0</h2>
                        <p className="text-secondary mb-8">
                            Version initiale du logiciel d&apos;analyse de champ. Code source complet et documentation disponibles sur GitHub.
                        </p>
                        <Link
                            href="https://github.com/Vida-Sin-Vida/CHRONON-1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-background font-bold rounded-full hover:bg-accent/90 transition-all duration-300 hover:scale-105 shadow-glow"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                            </svg>
                            Télécharger sur GitHub
                        </Link>
                    </div>
                </section>

                {/* Infographic Section */}
                <section className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-3xl font-serif font-bold text-accent">Aperçu du Système</h2>
                        <div className="h-px flex-grow bg-gradient-to-r from-accent/50 to-transparent"></div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-2 md:p-4 shadow-2xl hover:border-accent/30 transition-all duration-500 group">
                        <div className="relative w-full rounded-lg overflow-hidden bg-background/50">
                            {/* Using specific dimensions to prevent layout shift, but class ensures it scales */}
                            <img
                                src="/unnamed.png"
                                alt="Infographie du fonctionnement du programme Chronon"
                                className="w-full h-auto rounded-lg shadow-lg group-hover:scale-[1.01] transition-transform duration-500"
                            />
                        </div>
                        <p className="mt-4 text-center text-secondary text-sm italic">
                            Infographie synthétique des capacités d&apos;analyse du champ Chronon.
                        </p>
                    </div>
                </section>

                {/* Slideshow Section */}
                <section className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-3xl font-serif font-bold text-accent">Documentation Technique</h2>
                        <div className="h-px flex-grow bg-gradient-to-r from-accent/50 to-transparent"></div>
                    </div>

                    <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md p-8 rounded-xl border border-white/10 shadow-xl hover:shadow-accent/5 hover:border-accent/30 transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-32 bg-accent/5 blur-[100px] rounded-full pointer-events-none -mr-16 -mt-16"></div>

                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                            <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent/20 transition-colors duration-300 border border-accent/20">
                                <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">Le Point Chronon</h3>
                                <p className="text-secondary leading-relaxed mb-6">
                                    Diaporama technique détaillant le fondement théorique du programme.
                                    Une explication approfondie des mécanismes d&apos;interaction et de la structure du champ.
                                </p>

                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                    <button
                                        onClick={() => setIsPdfOpen(true)}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background font-bold rounded-lg hover:bg-accent/90 transition-all duration-300 hover:translate-y-[-2px] shadow-lg shadow-accent/20 cursor-pointer"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        Consulter le Diaporama
                                    </button>
                                    <a
                                        href="/point_chronon.pdf"
                                        download
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 text-primary font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                        Télécharger PDF
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* PDF Viewer Modal */}
            {isPdfOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8 animate-fade-in">
                    <div className="bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col relative transition-all duration-300 max-w-[1100px] w-full h-[90vh]">
                        <button
                            onClick={() => setIsPdfOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-black z-10 bg-white/50 rounded-full p-2 hover:bg-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="p-6 border-b border-gray-100 bg-gray-50 flex-shrink-0">
                            <h3 className="text-xl font-bold text-foreground">
                                Le Point Chronon - Documentation Technique
                            </h3>
                            <span className="text-sm text-secondary font-medium uppercase tracking-wide">
                                Diaporama PDF
                            </span>
                        </div>

                        <div className="flex-grow bg-black flex items-center justify-center overflow-hidden relative">
                            <PdfViewer src="/point_chronon.pdf" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/*
( ~ ~ ~ Φ(x) ~ ~ ~
Benjamin Brécheteau | Chronon Field 2025
~ ~ ~ ~ ~ ~ ~ ~ ~)
*/
