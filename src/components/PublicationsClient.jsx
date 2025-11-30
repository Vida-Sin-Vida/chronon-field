'use client';

import { useState, useMemo } from 'react';
import PublicationCard from './PublicationCard';

export default function PublicationsClient({ initialPublications }) {
    const [filterType, setFilterType] = useState('All');
    const [filterLanguage, setFilterLanguage] = useState('All');
    const [sortOrder, setSortOrder] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPublications = useMemo(() => {
        return initialPublications
            .filter((pub) => {
                const matchesType = filterType === 'All' || pub.type === filterType;
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
        <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                        Publications
                    </h1>
                    <p className="text-secondary text-lg max-w-2xl">
                        Archives des travaux de recherche de l'Institut.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mt-6 md:mt-0 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <select
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 text-sm bg-white"
                        value={filterLanguage}
                        onChange={(e) => setFilterLanguage(e.target.value)}
                    >
                        {languages.map(lang => (
                            <option key={lang} value={lang}>{lang === 'All' ? 'Toutes langues' : lang}</option>
                        ))}
                    </select>

                    <select
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 text-sm bg-white"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        {types.map(type => (
                            <option key={type} value={type}>{type === 'All' ? 'Tous types' : type}</option>
                        ))}
                    </select>

                    <select
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 text-sm bg-white"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="newest">Plus récent</option>
                        <option value="oldest">Plus ancien</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPublications.map((pub) => (
                    <PublicationCard key={pub.id} publication={pub} />
                ))}
            </div>

            {filteredPublications.length === 0 && (
                <div className="text-center py-20 text-secondary">
                    Aucune publication trouvée.
                </div>
            )}
        </div>
    );
}
