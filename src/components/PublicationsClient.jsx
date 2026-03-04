'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PublicationCard from './PublicationCard';
import ParticleBackground from './ParticleBackground';
import { useGlobal } from '../context/GlobalContext';

export default function PublicationsClient({ initialPublications }) {
    const { t } = useGlobal();
    const searchParams = useSearchParams();

    const [filterType, setFilterType] = useState('All');
    const [filterLanguage, setFilterLanguage] = useState('All');
    const [sortOrder, setSortOrder] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const typeParam = searchParams.get('type');
        if (typeParam) {
            setFilterType(typeParam);
        }
    }, [searchParams]);

    const filteredPublications = useMemo(() => {
        return initialPublications
            .filter((pub) => {
                const matchesType = filterType === 'All' || filterType.split(',').includes(pub.type);
                const matchesLanguage = filterLanguage === 'All' || pub.language === filterLanguage;
                const matchesSearch = pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    pub.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesType && matchesLanguage && matchesSearch;
            })
            .sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
            });
    }, [initialPublications, filterType, filterLanguage, sortOrder, searchQuery]);

    const types = ['All', ...new Set(initialPublications.map(p => p.type))];
    const languages = ['All', ...new Set(initialPublications.map(p => p.language))];

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 bg-background relative selection:bg-accent/30">
            <ParticleBackground />

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                            {t('publications_title')}
                        </h1>
                        <p className="text-secondary text-lg max-w-2xl">
                            {t('publications_desc')}
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mt-6 md:mt-0 w-full md:w-auto items-center">
                        <input
                            type="text"
                            placeholder={t('search_placeholder')}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 text-sm w-full md:w-auto"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />

                        <select
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 text-sm bg-white w-full md:w-auto"
                            value={filterLanguage}
                            onChange={(e) => setFilterLanguage(e.target.value)}
                        >
                            {languages.map(lang => (
                                <option key={lang} value={lang}>{lang === 'All' ? t('all_languages') : lang}</option>
                            ))}
                        </select>

                        <select
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 text-sm bg-white w-full md:w-auto"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            {/* Force display of combined types if coming from Program page */}
                            {filterType !== 'All' && !types.includes(filterType) && (
                                <option value={filterType}>{filterType}</option>
                            )}
                            {types.map(type => (
                                <option key={type} value={type}>{type === 'All' ? t('all_types') : type}</option>
                            ))}
                        </select>

                        <select
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 text-sm bg-white w-full md:w-auto"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="newest">{t('sort_newest')}</option>
                            <option value="oldest">{t('sort_oldest')}</option>
                        </select>

                        <button
                            onClick={() => {
                                setFilterType('All');
                                setFilterLanguage('All');
                                setSearchQuery('');
                                setSortOrder('newest');
                            }}
                            className="px-4 py-2 bg-accent/5 text-accent hover:bg-accent hover:text-white rounded-lg transition-all duration-300 text-sm font-medium border border-accent/20 flex items-center justify-center gap-2 w-full md:w-auto"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {t('reset_filters')}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPublications.map((pub) => (
                        <PublicationCard key={pub.id} publication={pub} />
                    ))}
                </div>

                {filteredPublications.length === 0 && (
                    <div className="text-center py-20 text-secondary">
                        {t('no_publications_found')}
                    </div>
                )}
            </div>
        </div>
    );
}

/*
( ~ ~ ~ Φ(x) ~ ~ ~
Benjamin Brécheteau | Chronon Field 2025
~ ~ ~ ~ ~ ~ ~ ~ ~)
*/
