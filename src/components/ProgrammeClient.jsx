'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useGlobal } from '../context/GlobalContext';
import ParticleBackground from './ParticleBackground';
import publicationsRaw from '../../data/publications.json';

const plannedPublications = [
    {
        id: "upcoming-1",
        title: "Philosophy of the Beat: Bergson, Heidegger and Local Time",
        title_en: "Philosophy of the Beat: Bergson, Heidegger and Local Time",
        type: "Article",
        status: "planned",
        branch: "theory",
        language: "FR/EN",
        date: "2026-03-01T12:00:00.000Z",
        excerpt: "Série Champ de Chronon — Épisode 5",
        excerpt_en: "The Chronon Field Series — Episode 5",
    },
    {
        id: "upcoming-2",
        title: "CHRONON-2 : Architecture et Spécifications",
        title_en: "CHRONON-2 : Architecture and Specifications",
        type: "Rapport",
        status: "planned",
        branch: "experimental",
        language: "EN",
        date: "2099-01-01T00:00:00.000Z",
        excerpt: "Design du prochain cycle expérimental et métrologique.",
        excerpt_en: "Design of the upcoming experimental and metrological cycle.",
    }
];

export default function ProgrammeClient() {
    const { t, language } = useGlobal();

    const [activeTab, setActiveTab] = useState('all');
    const [activePath, setActivePath] = useState('none');

    // Enhance raw publications with derived branch and status
    const publications = useMemo(() => {
        const enriched = publicationsRaw.map(pub => {
            let branch = 'theory';
            if (pub.type.toLowerCase().includes('rapport') || pub.type.toLowerCase().includes('protocole')) {
                branch = 'experimental';
            } else if (pub.type.toLowerCase().includes('collaboration')) {
                branch = 'collab';
            } else if (pub.type.toLowerCase().includes('programme')) {
                branch = 'software';
            }

            return {
                ...pub,
                status: 'published',
                branch,
                titleLocale: pub.title,
                excerptLocale: pub.excerpt
            };
        });

        const planned = plannedPublications.map(pub => ({
            ...pub,
            titleLocale: language === 'fr' ? pub.title : pub.title_en,
            excerptLocale: language === 'fr' ? pub.excerpt : pub.excerpt_en
        }));

        return [...enriched, ...planned];
    }, [language]);



    const readingPaths = [
        { id: 'new', title: t('program_path_new'), desc: t('program_path_new_desc'), refs: ["chronon-field-program.pdf", "the-time-that-beats.pdf", "renaissance-of-the-substrate.pdf"] },
        { id: 'theory', title: t('program_path_theory'), desc: t('program_path_theory_desc'), refs: ["chronon-field-physics-of-rhythm.pdf", "chronon-field-end-of-timeless-physics.pdf", "quantum-rhythm.pdf"] },
        { id: 'experimental', title: t('program_path_experimental'), desc: t('program_path_experimental_desc'), refs: ["chronon-1-progressive-validation.pdf", "chronon-1-pre-registration.pdf"] },
        { id: 'software', title: t('program_path_software'), desc: t('program_path_software_desc'), refs: ["chronon-field-program.pdf"] },
        { id: 'skeptic', title: t('program_path_skeptic'), desc: t('program_path_skeptic_desc'), refs: ["chronon-1-progressive-validation.pdf", "chronon-1-pre-registration.pdf", "chronon-1-sap.pdf", "chronon-1-stage-00-loop-closure.pdf", "chronons-and-void.pdf"] }
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-6 bg-background relative selection:bg-accent/30 overflow-hidden">
            <ParticleBackground />

            <div className="container mx-auto max-w-6xl relative z-10">
                {/* Hero Section */}
                <header className="mb-16 text-center animate-fade-in-up">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-accent mb-6 leading-tight">
                        {t('programme_hero_title')}
                    </h1>
                    <p className="text-lg md:text-xl text-secondary max-w-3xl mx-auto leading-relaxed mb-10">
                        {t('program_hero_subtitle')}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => document.getElementById('paths').scrollIntoView({ behavior: 'smooth' })}
                            className="group relative overflow-hidden px-8 py-4 bg-white text-gray-900 font-black text-lg rounded-full hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] transition-all duration-300 flex items-center gap-3"
                        >
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/30 to-transparent skew-x-12 transition-transform duration-1000 group-hover:translate-x-full"></div>
                            <span className="relative z-10">{t('program_cta_start')}</span>
                            <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 group-hover:bg-white transition-colors">
                                <svg className="w-5 h-5 text-gray-900 transition-transform duration-300 group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m0 0l-6-6m6 6l6-6" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </header>

                {/* Interactive Overview (Tabs) */}
                <section className="mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                            { id: 'theory', type: 'Article,Traité', title: t('program_tab_theory'), desc: t('program_tab_theory_desc'), icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                            { id: 'experimental', type: 'Protocole Expérimental,Rapport Technique', title: t('program_tab_experimental'), desc: t('program_tab_experimental_desc'), icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
                            { id: 'software', type: 'Programme', title: t('program_tab_software'), desc: t('program_tab_software_desc'), icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
                            { id: 'collab', type: 'Collaboration', title: t('program_tab_collab'), desc: t('program_tab_collab_desc'), icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }
                        ].map(tab => (
                            <Link
                                key={tab.id}
                                href={`/publications?type=${encodeURIComponent(tab.type)}`}
                                className={`text-left p-6 rounded-2xl border transition-all duration-300 group ${activeTab === tab.id
                                    ? 'bg-accent/10 border-accent/50 shadow-lg shadow-accent/10 scale-[1.02]'
                                    : 'bg-white/5 border-white/10 hover:border-accent/30 hover:bg-white/10'
                                    }`}
                            >
                                <svg className={`w-8 h-8 mb-4 transition-colors ${activeTab === tab.id ? 'text-accent' : 'text-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
                                </svg>
                                <h3 className={`text-lg font-bold mb-2 transition-colors ${activeTab === tab.id ? 'text-accent' : 'text-primary'}`}>{tab.title}</h3>
                                <p className="text-secondary text-sm leading-relaxed">{tab.desc}</p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Recommended Reading Paths */}
                <section id="paths" className="mb-24">
                    <div className="flex items-center gap-4 mb-10">
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-accent">{t('program_path_title')}</h2>
                        <div className="h-px flex-grow bg-gradient-to-r from-accent/50 to-transparent"></div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {readingPaths.map(path => {
                            // Find actual publications for this path
                            const pathPubs = path.refs.map(ref => publications.find(p => p.id === ref)).filter(Boolean);
                            const isActive = activePath === path.id;

                            return (
                                <div key={path.id} className={`border rounded-xl overflow-hidden transition-all duration-300 ${isActive ? 'bg-gray-100 border-gray-100 shadow-xl' : 'bg-white/5 border-white/10 hover:border-accent/30'}`}>
                                    <button
                                        onClick={() => setActivePath(isActive ? 'none' : path.id)}
                                        className="w-full text-left p-6 flex items-center justify-between focus:outline-none group"
                                    >
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-accent transition-colors">{path.title}</h3>
                                            <p className="text-gray-600 text-sm mt-1">{path.desc}</p>
                                        </div>
                                        <svg
                                            className={`w-6 h-6 transform transition-transform duration-300 ${isActive ? 'rotate-180 text-gray-900' : 'text-accent'}`}
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {isActive && (
                                        <div className="px-6 pb-6 bg-gray-100 border-t border-gray-200 pt-4 animate-fade-in">
                                            <ul className="space-y-4">
                                                {pathPubs.map((pub, idx) => (
                                                    <li key={idx} className="flex flex-col sm:flex-row items-start gap-4 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                                        <span className="text-accent font-black mt-0.5 text-xl min-w-[28px]">{idx + 1}.</span>
                                                        <div>
                                                            <Link href={pub.link || "#"} className="text-gray-900 hover:text-accent font-bold transition-colors block mb-2 text-base md:text-lg">
                                                                {pub.titleLocale}
                                                            </Link>
                                                            <div className="flex items-center gap-3 text-sm">
                                                                <span className="px-2.5 py-1 bg-accent/10 text-accent font-bold rounded shadow-sm">{pub.type}</span>
                                                                <span className="text-gray-600 font-medium">{new Date(pub.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long' })}</span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Roadmap / Timeline (Visual abstract) */}
                <section className="mb-24">
                    <div className="flex items-center gap-4 mb-10">
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-accent">Roadmap</h2>
                        <div className="h-px flex-grow bg-gradient-to-r from-accent/50 to-transparent"></div>
                    </div>

                    <div className="relative border-l-2 border-accent/20 pl-6 ml-2 md:ml-6 space-y-8 mb-12">
                        {publications.filter(p => p.language && p.language.includes('EN')).sort((a, b) => new Date(b.date) - new Date(a.date)).map((pub, idx) => (
                            <div key={idx} className="relative group">
                                <div className={`absolute -left-[35px] w-4 h-4 rounded-full border-2 bg-background transition-colors ${pub.status === 'planned' ? 'border-secondary' : 'border-accent'}`}></div>
                                <div className="bg-white/5 border border-white/10 p-4 rounded-lg inline-block hover:border-accent/30 hover:bg-white/10 transition-colors">
                                    <span className="text-xs font-mono text-accent block mb-1">
                                        {new Date(pub.date).getFullYear() > 2090
                                            ? (language === 'fr' ? 'À venir' : 'Coming soon')
                                            : new Date(pub.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long' })}
                                    </span>
                                    <h4 className="text-primary font-semibold">{pub.titleLocale}</h4>
                                    <span className="text-xs text-secondary mt-1 block">{pub.status === 'planned' ? t('program_status_planned') : t('program_status_published')}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-4 mt-8">
                        <Link
                            href="/publications"
                            className="px-8 py-3 bg-transparent text-accent font-semibold rounded-full border border-accent hover:bg-accent/10 transition-all duration-300"
                        >
                            {t('program_cta_publications')}
                        </Link>
                        <Link
                            href="/logiciel"
                            className="px-8 py-3 bg-white/5 text-primary font-semibold rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                        >
                            {t('program_cta_software')}
                        </Link>
                    </div>
                </section>


            </div>
        </div>
    );
}
