const SERIES_IDS = [
    'The_Instant__Memory_and_Resonance__Revisiting_Lived_Time.pdf',
    'L_Instant__la_Mémoire_et_la_Résonance___le_temps_vécu_revisité.pdf',
    'renaissance-of-the-substrate.pdf',
    'renaissance-du-substrat.pdf',
    'the-time-that-beats.pdf',
    'quantum-rhythm.pdf',
    'le-temps-qui-bat.pdf',
    'chronon-field-end-of-timeless-physics.pdf',
    'philosophie-du-battement.pdf',
    'philosophy-of-the-beat.pdf',
    'Philosophy_of_the_Beat__Bergson__Heidegger_and_Local_Time.pdf',
    'Philosophie_du_battement___Bergson__Heidegger_et_le_temps_local.pdf',
    'CFC__Rethinking_Expansion_and_Horizon.pdf'
];

export default function PublicationCard({ publication }) {
    const isSeries = SERIES_IDS.includes(publication.id);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col h-full relative group overflow-hidden">
            {isSeries && (
                <div
                    className="absolute w-[336px] h-[336px] opacity-[0.25] group-hover:opacity-[0.5] transition-opacity duration-500 pointer-events-none z-0 bg-contain bg-no-repeat bg-right-bottom"
                    style={{
                        bottom: '-38px',
                        right: '-164px',
                        backgroundImage: "url('/symbole/Chronon%20Fields%20Series_Symbole.png')",
                    }}
                />
            )}

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 text-xs font-medium bg-secondary/10 text-secondary rounded-full">
                        {publication.type}
                    </span>
                    <span className="text-xs text-secondary/70">
                        {new Date(publication.date).toLocaleDateString()}
                    </span>
                </div>

                <h3 className="text-xl font-serif font-bold text-foreground mb-2">
                    {publication.title}
                </h3>

                <p className="text-sm text-secondary mb-4 italic">
                    {publication.authors}
                </p>

                <p className="text-secondary/80 text-sm mb-6 flex-grow">
                    {publication.excerpt}
                </p>

                <a
                    href={publication.link}
                    className="inline-flex items-center justify-center px-4 py-2 bg-background border border-secondary/20 text-accent text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 mt-auto"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    PDF
                </a>
            </div>
        </div>
    );
}
