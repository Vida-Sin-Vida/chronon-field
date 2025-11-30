import fs from 'fs';
import path from 'path';

const DOCUMENTS_DIR = path.join(process.cwd(), 'public', 'document');

const METADATA = {
    'chronon_field_serie_1_en.pdf': {
        title: 'The Chronon Field Series - Episode 1',
        type: 'Article',
        excerpt: 'First episode of the series explaining the fundamentals of the Chronon Field theory.',
        authors: 'B. Brécheteau',
        language: 'EN',
        date: '2025-11-01'
    },
    'chronon_field_serie_1_fr.pdf': {
        title: 'Série Champ de Chronon - Épisode 1',
        type: 'Article',
        excerpt: 'Premier épisode de la série expliquant les fondamentaux de la théorie du champ de Chronon.',
        authors: 'B. Brécheteau',
        language: 'FR',
        date: '2025-11-01'
    },
    'traité_fr.pdf': {
        title: 'Traité de Mécanique Temporelle',
        type: 'Traité',
        excerpt: 'Analyse approfondie des structures dissipatives dans le continuum espace-temps.',
        authors: 'B. Brécheteau',
        language: 'FR',
        date: '2025-10-27'
    },
    'CHRONON_1.pdf': {
        title: 'Chronon 1 - Rapport Préliminaire',
        type: 'Protocole Expérimental',
        excerpt: 'Premières observations expérimentales.',
        authors: 'B. Brécheteau',
        language: 'FR',
        date: '2025-11-10'
    }
};

export function getPublicationsData() {
    if (!fs.existsSync(DOCUMENTS_DIR)) {
        return [];
    }

    const files = fs.readdirSync(DOCUMENTS_DIR);

    const publications = files
        .filter(file => file.toLowerCase().endsWith('.pdf'))
        .map(file => {
            const filePath = path.join(DOCUMENTS_DIR, file);
            const stats = fs.statSync(filePath);

            // Default derived values
            const nameWithoutExt = file.replace(/\.pdf$/i, '');
            let language = 'FR';
            if (nameWithoutExt.endsWith('_en')) language = 'EN';

            let title = nameWithoutExt.replace(/_/g, ' ').replace(/_(en|fr)$/i, '');
            title = title.replace(/\b\w/g, l => l.toUpperCase());

            let type = 'Article';
            if (title.toLowerCase().includes('article')) type = 'Article';
            if (title.toLowerCase().includes('traité')) type = 'Traité';

            let excerpt = `Document PDF (${language}) - ${(stats.size / 1024 / 1024).toFixed(2)} MB`;
            let authors = 'Institut Chronon Field';

            // Override with manual metadata if exists
            if (METADATA[file]) {
                const m = METADATA[file];
                if (m.title) title = m.title;
                if (m.type) type = m.type;
                if (m.excerpt) excerpt = m.excerpt;
                if (m.authors) authors = m.authors;
                if (m.language) language = m.language;
                if (m.date) stats.birthtime = new Date(m.date); // Override date
            }

            return {
                id: file,
                title: title,
                type: type,
                language: language,
                date: stats.birthtime.toISOString(),
                excerpt: excerpt,
                link: `/document/${file}`,
                authors: authors,
                isPdf: true
            };


        })
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first by default

    return publications;
}
