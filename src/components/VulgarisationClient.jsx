'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ImageViewer from './ImageViewer';
import AudioPlayer from './AudioPlayer';
import ParticleBackground from './ParticleBackground';

const PdfViewer = dynamic(() => import('./PdfViewer'), { ssr: false });

import { useGlobal } from '../context/GlobalContext';

export default function VulgarisationClient({ series }) {
    const { setIsNavbarVisible, t, language } = useGlobal();
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [viewingFormat, setViewingFormat] = useState(null); // { type: 'Audio', articleId: '...' }

    // Panel visibility states
    const [isSeriesPanelOpen, setIsSeriesPanelOpen] = useState(false);
    const [isFormatsPanelOpen, setIsFormatsPanelOpen] = useState(false);

    const handleSeriesClick = (s) => {
        setSelectedSeries(s);
        setSelectedArticle(null);
        setIsFormatsPanelOpen(false);
        setIsNavbarVisible(false); // Hide Navbar
        // Delay opening to allow render before transition
        setTimeout(() => setIsSeriesPanelOpen(true), 10);
    };

    const handleArticleClick = (article) => {
        if (!article.isPublished) return;
        setSelectedArticle(article);
        setTimeout(() => setIsFormatsPanelOpen(true), 10);
    };

    const handleFormatClick = (format, article) => {
        setViewingFormat({ type: format.type, src: format.src, article });
    };

    const closeViewer = () => {
        setViewingFormat(null);
    };

    const handleBackToSeries = () => {
        setIsFormatsPanelOpen(false);
        setIsSeriesPanelOpen(false);
        setIsNavbarVisible(true); // Show Navbar
    };

    const handleBackToArticles = () => {
        setIsFormatsPanelOpen(false);
    };

    const onSeriesPanelTransitionEnd = (e) => {
        if (!isSeriesPanelOpen && e.propertyName === 'transform' && e.target === e.currentTarget) {
            setSelectedSeries(null);
            setSelectedArticle(null);
            const firstCard = document.getElementById('series-card-0');
            if (firstCard) firstCard.focus();
        }
    };

    const onFormatsPanelTransitionEnd = (e) => {
        if (!isFormatsPanelOpen && e.propertyName === 'transform' && e.target === e.currentTarget) {
            setSelectedArticle(null);
            const firstArticle = document.getElementById('article-card-0');
            if (firstArticle) firstArticle.focus();
        }
    };

    // Determine modal size based on content type
    const getModalSizeClass = () => {
        if (!viewingFormat) return 'max-w-5xl';
        if (viewingFormat.type === 'Point Scientifique') return 'max-w-[1100px] w-full h-[90vh]';
        if (viewingFormat.type === 'Mind Map' || viewingFormat.type === 'Infographie') return 'max-w-[95vw] w-full h-[95vh]';
        return 'max-w-5xl';
    };

    // Helper to get text based on language (handles if data is string or object)
    const getLocalizedText = (data) => {
        if (typeof data === 'string') return data;
        return data[language] || data['fr'];
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 bg-background relative selection:bg-accent/30 overflow-hidden">
            <ParticleBackground />

            <div className="container mx-auto px-6 py-12 relative z-10">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-12">
                    {t('vulgarisation_title')}
                </h1>

                {/* Series Selection (Main View) */}
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-500 ${isSeriesPanelOpen ? 'opacity-50 pointer-events-none transform -translate-x-10' : ''}`}>
                    {series.map((s, index) => (
                        <div
                            key={s.id}
                            id={`series-card-${index}`}
                            onClick={() => handleSeriesClick(s)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleSeriesClick(s);
                                }
                            }}
                            tabIndex="0"
                            role="button"
                            className="group cursor-pointer bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-accent/30 outline-none focus:ring-2 focus:ring-accent/50 relative overflow-hidden"
                        >
                            {s.id === 'chronon-field' && (
                                <div
                                    className="absolute pointer-events-none z-0 bg-contain bg-no-repeat bg-center opacity-[0.12] group-hover:opacity-[0.20] transition-opacity duration-500"
                                    style={{
                                        width: '360px',
                                        height: '360px',
                                        bottom: '-180px',
                                        right: '-180px',
                                        backgroundImage: "url('/symbole/Chronon%20Fields%20Series_Symbole.png')",
                                    }}
                                />
                            )}
                            <div className="relative z-10">
                                <h2 className="text-2xl font-serif font-bold text-foreground mb-4 group-hover:text-accent transition-colors">
                                    {getLocalizedText(s.title)}
                                </h2>
                                <p className="text-secondary text-lg">
                                    {getLocalizedText(s.description)}
                                </p>
                                <div className="mt-6 flex items-center text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                                    {t('explore_series')} <span className="ml-2">→</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Level 2: Articles List (Slide-over) */}
                <div
                    className={`fixed inset-y-0 right-0 w-full md:w-2/3 lg:w-1/2 bg-white shadow-2xl transform transition-transform duration-500 ease-in-out z-20 ${isSeriesPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    onTransitionEnd={onSeriesPanelTransitionEnd}
                >
                    {selectedSeries && (
                        <div className="h-full flex flex-col p-8 md:p-12 overflow-y-auto">
                            <div className="flex items-center mb-2 mt-24 group">
                                <button
                                    onClick={handleBackToSeries}
                                    className="mr-4 text-secondary hover:text-accent transition-all duration-300 transform hover:scale-110 outline-none focus:text-accent"
                                    aria-label={t('back_to_series')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </button>
                                <h2 className="text-3xl font-serif font-bold text-foreground">
                                    {getLocalizedText(selectedSeries.title)}
                                </h2>
                            </div>

                            <p className="text-secondary mb-12 ml-12">
                                {getLocalizedText(selectedSeries.description)}
                            </p>

                            <div className="space-y-4">
                                {selectedSeries.articles.map((article, index) => (
                                    <div
                                        key={article.id}
                                        id={`article-card-${index}`}
                                        onClick={() => handleArticleClick(article)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleArticleClick(article);
                                            }
                                        }}
                                        tabIndex={article.isPublished ? "0" : "-1"}
                                        role="button"
                                        aria-disabled={!article.isPublished}
                                        className={`p-6 rounded-lg border transition-all duration-200 group relative
                                            ${article.isPublished
                                                ? 'cursor-pointer border-gray-100 hover:border-accent/30 hover:bg-gray-50 outline-none focus:ring-2 focus:ring-accent/50'
                                                : 'cursor-not-allowed border-gray-100 bg-gray-50 opacity-60'}`}
                                    >
                                        <div className="pr-12">
                                            <h3 className="text-xl font-bold text-foreground mb-2">
                                                {getLocalizedText(article.title)}
                                            </h3>
                                            <p className="text-sm text-secondary">
                                                {article.isPublished ? `${article.formats.length} ${t('formats_available')}` : t('soon_available')}
                                            </p>
                                        </div>
                                        {article.isPublished && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-6 top-1/2 -translate-y-1/2 h-8 w-8 text-secondary transition-all duration-300 transform group-hover:text-accent group-hover:scale-110 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                            </svg>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Level 3: Formats Selection (Slide-over on top of Articles) */}
                <div
                    className={`fixed inset-y-0 right-0 w-full md:w-2/3 lg:w-1/2 bg-gray-50 shadow-2xl transform transition-transform duration-500 ease-in-out z-30 ${isFormatsPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    onTransitionEnd={onFormatsPanelTransitionEnd}
                >
                    {selectedArticle && (
                        <div className="h-full flex flex-col p-8 md:p-12 overflow-y-auto">
                            <div className="flex items-center mb-2 mt-24 group">
                                <button
                                    onClick={handleBackToArticles}
                                    className="mr-4 text-secondary hover:text-accent transition-all duration-300 transform hover:scale-110 outline-none focus:text-accent"
                                    aria-label={t('back_to_articles')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </button>
                                <h2 className="text-2xl font-serif font-bold text-foreground">
                                    {getLocalizedText(selectedArticle.title)}
                                </h2>
                            </div>

                            <p className="text-secondary mb-8">
                                {t('select_format')}
                            </p>

                            <div className="grid grid-cols-1 gap-4">
                                {selectedArticle.formats.map((format) => (
                                    <button
                                        key={format.type}
                                        onClick={() => handleFormatClick(format, selectedArticle)}
                                        className="p-6 bg-white border border-gray-200 rounded-xl text-left hover:border-accent hover:shadow-md transition-all duration-300 group"
                                    >
                                        <span className="block text-lg font-bold text-foreground group-hover:text-accent mb-1">
                                            {format.type}
                                        </span>
                                        <span className="text-sm text-secondary">
                                            {t('consult_format_prefix')} {format.type.toLowerCase()}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Popup Viewer */}
                {
                    viewingFormat && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8 animate-fade-in">
                            <div className={`bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col relative transition-all duration-300 ${getModalSizeClass()}`}>
                                <div className="p-6 border-b border-gray-100 bg-gray-50 flex-shrink-0 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground">
                                            {getLocalizedText(viewingFormat.article.title)}
                                        </h3>
                                        <span className="text-sm text-secondary font-medium uppercase tracking-wide">
                                            {viewingFormat.type}
                                        </span>
                                    </div>
                                    <button
                                        onClick={closeViewer}
                                        className="text-gray-500 hover:text-black hover:bg-black/5 rounded-full p-2 transition-colors ml-4"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="flex-grow bg-black flex items-center justify-center overflow-hidden relative">
                                    {viewingFormat.type === 'Mind Map' || viewingFormat.type === 'Infographie' ? (
                                        <ImageViewer src={viewingFormat.src} alt={viewingFormat.type} />
                                    ) : viewingFormat.type === 'Audio' ? (
                                        <AudioPlayer src={viewingFormat.src} title={getLocalizedText(viewingFormat.article.title)} />
                                    ) : viewingFormat.type === 'Vidéo' ? (
                                        <video controls className="max-w-full max-h-full">
                                            <source src={viewingFormat.src} />
                                            {t('video_not_supported')}
                                        </video>
                                    ) : viewingFormat.type === 'Point Scientifique' ? (
                                        <PdfViewer src={viewingFormat.src} />
                                    ) : (
                                        <div className="text-white text-center">
                                            <p className="text-2xl mb-4">{t('format_not_supported')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div >
    );
}

/*
( ~ ~ ~ Φ(x) ~ ~ ~
Benjamin Brécheteau | Chronon Field 2025
~ ~ ~ ~ ~ ~ ~ ~ ~)
*/
