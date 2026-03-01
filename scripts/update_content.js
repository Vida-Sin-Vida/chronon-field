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
const PUBLICATIONS_JSON_PATH = path.join(DATA_DIR, 'publications.json');
let existingPublications = [];
if (fs.existsSync(PUBLICATIONS_JSON_PATH)) {
    try {
        existingPublications = JSON.parse(fs.readFileSync(PUBLICATIONS_JSON_PATH, 'utf8'));
    } catch (e) {
        console.warn('Could not parse existing publications.json');
    }
}

const files = fs.readdirSync(DOCUMENTS_DIR).filter(f => f.toLowerCase().endsWith('.pdf'));
const publications = files.map(file => {
    const filePath = path.join(DOCUMENTS_DIR, file);
    const stats = fs.statSync(filePath);
    const existingEntry = existingPublications.find(p => p.id === file);

    // Basic metadata extraction logic
    const nameWithoutExt = file.replace(/\.pdf$/i, '');
    let language = 'EN'; // Default to EN for the specific documents renamed
    if (nameWithoutExt.includes('du-substrat') || nameWithoutExt.includes('le-temps-qui-bat') || nameWithoutExt.includes('champ-de-chronon')) language = 'FR';

    let title = nameWithoutExt.replace(/-/g, ' ');
    title = title.replace(/\b\w/g, l => l.toUpperCase());

    // Custom overrides based on the new naming convention
    if (file === 'le-temps-qui-bat.pdf') title = 'Le Temps qui bat : Redéfinir la pulsation du réel';
    if (file === 'the-time-that-beats.pdf') title = 'The Time That Beats: Redefining the Pulse of the Real';
    if (file === 'chronon-field-end-of-timeless-physics.pdf') title = 'Chronon Field and the End of Timeless Physics';
    if (file === 'renaissance-du-substrat.pdf') title = 'La Renaissance du Substrat';
    if (file === 'renaissance-of-the-substrate.pdf') title = 'The Renaissance of the Substrate';
    if (file === 'quantum-rhythm.pdf') title = 'Quantum Rhythm: When Information Breathes in Time';

    if (file === 'chronon-1-pre-registration.pdf') title = 'CHRONON-1: Experimental Pre-Registration';
    if (file === 'chronon-1-sap.pdf') title = 'CHRONON-1: Statistical Analysis Plan (SAP)';
    if (file === 'chronon-1-progressive-validation.pdf') title = 'CHRONON-1: Progressive Validation';
    if (file === 'chronon-1-stage-00-loop-closure.pdf') title = 'CHRONON-1 (Stage 00): Loop-closure null tests';

    if (file === 'champ-de-chronon-physique-du-rythme.pdf') title = 'Champ de Chronon Φ(x) et Physique du Rythme';
    if (file === 'chronon-field-physics-of-rhythm.pdf') title = 'Chronon Field Φ(x) and the Physics of Rhythm';
    if (file === 'chronons-and-void.pdf') title = 'Chronons and Void : Critical Dialogue';
    if (file === 'chronon-field-program.pdf') title = 'The Chronon Field Program';
    if (file === 'Philosophie_du_battement___Bergson__Heidegger_et_le_temps_local.pdf') {
        title = 'Philosophie du battement : Bergson, Heidegger et le temps local';
        language = 'FR';
    }
    if (file === 'Philosophy_of_the_Beat__Bergson__Heidegger_and_Local_Time.pdf') {
        title = 'Philosophy of the Beat: Bergson, Heidegger and Local Time';
        language = 'EN';
    }

    let type = 'Article';
    if (file.includes('sap') || file.includes('validation') || file.includes('pre-registration')) type = 'Protocole Expérimental';
    if (file.includes('stage-00')) type = 'Rapport Technique';
    if (file.includes('physics-of-rhythm') || file.includes('physique-du-rythme')) type = 'Traité';
    if (file.includes('chronons-and-void')) type = 'Collaboration';
    if (file.includes('program')) type = 'Programme';

    return {
        id: file,
        title: title,
        type: type,
        language: language,
        date: existingEntry ? existingEntry.date : stats.mtime.toISOString(),
        excerpt: `Document PDF (${language}) - ${(stats.size / 1024 / 1024).toFixed(2)} MB`,
        link: `/document/${file}`,
        authors: existingEntry ? existingEntry.authors : 'B. Brécheteau',
        size: stats.size
    };
}).sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(PUBLICATIONS_JSON_PATH, JSON.stringify(publications, null, 2));
console.log('Generated data/publications.json');

// 3. Generate data/vulgarisation.json
function scanVulgarisationData() {
    const seriesMetadata = [
        {
            id: 'chronon-field',
            title: { fr: 'Série Champ de Chronon', en: 'The Chronon Field Series' },
            description: {
                fr: 'Une plongée au cœur de la théorie du champ de chronon.',
                en: 'A deep dive into the Chronon field theory.'
            },
            folderName: 'chronon_field_serie',
            totalEpisodes: 12
        },
        {
            id: 'other',
            title: { fr: 'Autre', en: 'Other' },
            description: {
                fr: 'Explorations diverses et curiosités scientifiques.',
                en: 'Various explorations and scientific curiosities.'
            },
            folderName: 'Other',
            totalEpisodes: 1
        }
    ];

    const result = seriesMetadata.map(series => {
        const seriesPath = path.join(PUBLICATIONS_DIR, series.folderName);
        const articles = [];

        for (let i = 1; i <= series.totalEpisodes; i++) {
            const episodeId = `${series.id}-${i.toString().padStart(2, '0')}`;
            const episodePath = path.join(seriesPath, i.toString());
            const formats = [];

            if (fs.existsSync(episodePath)) {
                const getAssetUrl = (filename) => {
                    const filePath = path.join(episodePath, filename);
                    if (fs.existsSync(filePath)) {
                        const mtime = Math.floor(fs.statSync(filePath).mtimeMs);
                        return `/publication/${series.folderName}/${i}/${filename}?v=${mtime}`;
                    }
                    return null;
                };

                const mapUrl = getAssetUrl(`map_${i}.png`);
                if (mapUrl) formats.push({ type: 'Mind Map', src: mapUrl });

                const graphiUrl = getAssetUrl(`graphi_${i}.png`);
                const graphUrl = getAssetUrl(`graph_${i}.png`);
                if (graphiUrl) formats.push({ type: 'Infographie', src: graphiUrl });
                else if (graphUrl) formats.push({ type: 'Infographie', src: graphUrl });

                const audioM4aUrl = getAssetUrl(`audio_${i}.m4a`);
                const audioMp4Url = getAssetUrl(`audio_${i}.mp4`);
                if (audioM4aUrl) formats.push({ type: 'Audio', src: audioM4aUrl });
                else if (audioMp4Url) formats.push({ type: 'Audio', src: audioMp4Url });

                const videoUrl = getAssetUrl(`video_${i}.mp4`);
                if (videoUrl) formats.push({ type: 'Vidéo', src: videoUrl });

                const pointUrl = getAssetUrl(`point_${i}.pdf`);
                if (pointUrl) formats.push({ type: 'Point Scientifique', src: pointUrl });
            }

            let title = { fr: `${i.toString().padStart(2, '0')} — `, en: `${i.toString().padStart(2, '0')} — ` };

            if (formats.length > 0) {
                if (i === 1 && series.id === 'chronon-field') {
                    title.fr += 'Le temps qui bat';
                    title.en += 'The Beating Time';
                } else if (i === 2 && series.id === 'chronon-field') {
                    title.fr += 'L\'effondrement opérationnel';
                    title.en += 'Operational Collapse';
                } else if (i === 3 && series.id === 'chronon-field') {
                    title.fr += 'La tenue du réel';
                    title.en += 'The Holding of Reality';
                } else if (i === 4 && series.id === 'chronon-field') {
                    title.fr += 'Rythme Quantique';
                    title.en += 'Quantum Rhythm';
                } else if (i === 5 && series.id === 'chronon-field') {
                    title.fr += 'Le Temps des Objets';
                    title.en += 'The Time of Objects';
                } else if (i === 1 && series.id === 'other') {
                    title.fr += 'Chronon & Vide : Dialogue critique';
                    title.en += 'Chronon & Void: Critical Dialogue';
                } else {
                    title.fr += 'Episode ' + i;
                    title.en += 'Episode ' + i;
                }
            } else {
                title.fr += 'A venir';
                title.en += 'Coming soon';
            }

            articles.push({
                id: episodeId,
                title: title,
                formats: formats,
                isPublished: formats.length > 0
            });
        }

        return { ...series, articles };
    });

    fs.writeFileSync(path.join(DATA_DIR, 'vulgarisation.json'), JSON.stringify(result, null, 2));
    console.log('Generated data/vulgarisation.json');
}

scanVulgarisationData();
