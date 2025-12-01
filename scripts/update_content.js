const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../public');
const DATA_DIR = path.join(__dirname, '../data');
const DOCUMENTS_DIR = path.join(PUBLIC_DIR, 'document');
const PUBLICATIONS_DIR = path.join(PUBLIC_DIR, 'publication');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 1. Fix typos and rename files
const renames = [
    { dir: DOCUMENTS_DIR, from: 'chonon_field_serie_2_en.pdf', to: 'chronon_field_serie_2_en.pdf' },
    { dir: path.join(PUBLICATIONS_DIR, 'chronon_field_serie/1'), from: 'graph_1.png', to: 'graphi_1.png' },
    { dir: path.join(PUBLICATIONS_DIR, 'chronon_field_serie/2'), from: 'graph_2.png', to: 'graphi_2.png' }
];

renames.forEach(({ dir, from, to }) => {
    const oldPath = path.join(dir, from);
    const newPath = path.join(dir, to);
    if (fs.existsSync(oldPath)) {
        console.log(`Renaming ${from} to ${to}`);
        fs.renameSync(oldPath, newPath);
    } else if (fs.existsSync(newPath)) {
        console.log(`${to} already exists.`);
    } else {
        console.warn(`Warning: ${from} not found in ${dir}`);
    }
});

// 2. Generate data/publications.json
const files = fs.readdirSync(DOCUMENTS_DIR).filter(f => f.toLowerCase().endsWith('.pdf'));
const publications = files.map(file => {
    const filePath = path.join(DOCUMENTS_DIR, file);
    const stats = fs.statSync(filePath);

    // Basic metadata extraction logic (similar to existing lib/publications.js)
    const nameWithoutExt = file.replace(/\.pdf$/i, '');
    let language = 'FR';
    if (nameWithoutExt.endsWith('_en')) language = 'EN';

    let title = nameWithoutExt.replace(/_/g, ' ').replace(/_(en|fr)$/i, '');
    title = title.replace(/\b\w/g, l => l.toUpperCase());

    let type = 'Article';
    if (title.toLowerCase().includes('traité')) type = 'Traité';

    // Custom overrides based on filename patterns
    if (file.includes('chronon_field_serie_1')) title = 'The Chronon Field Series - Episode 1';
    if (file.includes('chronon_field_serie_2')) title = 'The Chronon Field Series - Episode 2';
    if (file === 'CHRONON_1.pdf') title = 'Chronon 1 - Rapport Préliminaire';

    return {
        id: file,
        title: title,
        type: type,
        language: language,
        date: stats.mtime.toISOString(), // Using mtime as requested
        excerpt: `Document PDF (${language}) - ${(stats.size / 1024 / 1024).toFixed(2)} MB`,
        link: `/document/${file}`,
        authors: 'Institut Chronon Field',
        size: stats.size
    };
}).sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(path.join(DATA_DIR, 'publications.json'), JSON.stringify(publications, null, 2));
console.log('Generated data/publications.json');
