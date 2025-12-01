'use client';

import { useState } from 'react';
import ImageViewer from './ImageViewer';
import AudioPlayer from './AudioPlayer';

export default function VulgarisationClient({ series }) {
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

    return (
        <div className="container mx-auto px-6 py-12 relative min-h-screen overflow-hidden">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-12">
                Vulgarisation
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
                        className="group cursor-pointer bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-accent/30 outline-none focus:ring-2 focus:ring-accent/50"
                    >
                        <h2 className="text-2xl font-serif font-bold text-foreground mb-4 group-hover:text-accent transition-colors">
                            {s.title}
                        </h2>
                        <p className="text-secondary text-lg">
                            {s.description}
                        </p>
                        <div className="mt-6 flex items-center text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                            Explorer la série <span className="ml-2">→</span>
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
                                aria-label="Retour aux séries"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>
                            <h2 className="text-3xl font-serif font-bold text-foreground">
                                {selectedSeries.title}
                            </h2>
                        </div>

                        <p className="text-secondary mb-12 ml-12">
                            {selectedSeries.description}
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
                                    className={`p-6 rounded-lg border transition-all duration-200 
                                        ${article.isPublished
                                            ? 'cursor-pointer border-gray-100 hover:border-accent/30 hover:bg-gray-50 outline-none focus:ring-2 focus:ring-accent/50'
                                            : 'cursor-not-allowed border-gray-100 bg-gray-50 opacity-60'}`}
                                >
                                    <h3 className="text-xl font-bold text-foreground mb-2 flex justify-between items-center">
                                        {article.title}
                                        {article.isPublished && <span className="text-accent text-sm">→</span>}
                                    </h3>
                                    <p className="text-sm text-secondary">
                                        {article.isPublished ? `${article.formats.length} formats disponibles` : 'Bientôt disponible'}
                                    </p>
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
                                aria-label="Retour aux articles"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>
                            <h2 className="text-2xl font-serif font-bold text-foreground">
                                {selectedArticle.title}
                            </h2>
                        </div>

                        <p className="text-secondary mb-8">
                            Sélectionnez un format pour consulter ce contenu :
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
                                        Consulter le format {format.type.toLowerCase()}
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8 animate-fade-in">
                        <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-xl overflow-hidden shadow-2xl flex flex-col relative">
                            <button
                                onClick={closeViewer}
                                className="absolute top-4 right-4 text-gray-500 hover:text-black z-10 bg-white/50 rounded-full p-2 hover:bg-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="p-6 border-b border-gray-100 bg-gray-50">
                                <h3 className="text-xl font-bold text-foreground">
                                    {viewingFormat.article.title}
                                </h3>
                                <span className="text-sm text-secondary font-medium uppercase tracking-wide">
                                    {viewingFormat.type}
                                </span>
                            </div>

                            <div className="flex-grow bg-black flex items-center justify-center p-4 overflow-auto">
                                {viewingFormat.type === 'Mind Map' || viewingFormat.type === 'Infographie' ? (
                                    <ImageViewer src={viewingFormat.src} alt={viewingFormat.type} />
                                ) : viewingFormat.type === 'Audio' ? (
                                    <AudioPlayer src={viewingFormat.src} title={viewingFormat.article.title} />
                                ) : viewingFormat.type === 'Vidéo' ? (
                                    <video controls className="max-w-full max-h-full">
                                        <source src={viewingFormat.src} />
                                        Votre navigateur ne supporte pas l'élément vidéo.
                                    </video>
                                ) : (viewingFormat.type === 'Point Scientifique' || viewingFormat.type.includes('Article Complet')) ? (
                                    <iframe src={viewingFormat.src} className="w-full h-full bg-white" title={viewingFormat.type} />
                                ) : (
                                    <div className="text-white text-center">
                                        <p className="text-2xl mb-4">Format non supporté</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
