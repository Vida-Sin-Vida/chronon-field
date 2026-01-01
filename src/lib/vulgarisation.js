import fs from 'fs';
import path from 'path';

const PUBLICATION_DIR = path.join(process.cwd(), 'public', 'publication');
const DOCUMENTS_DIR = path.join(process.cwd(), 'public', 'document');

export function getVulgarisationData() {
    // Define series metadata statically as requested, but scan for content
    const seriesMetadata = [
        {
            id: 'chronon-field',
            title: {
                fr: 'Série Champ de Chronon',
                en: 'The Chronon Field Series'
            },
            description: {
                fr: 'Une plongée au cœur de la théorie du champ de chronon.',
                en: 'A deep dive into the Chronon field theory.'
            },
            folderName: 'chronon_field_serie',
            totalEpisodes: 12 // As per original data
        },
        {
            id: 'other',
            title: {
                fr: 'Autre',
                en: 'Other'
            },
            description: {
                fr: 'Explorations diverses et curiosités scientifiques.',
                en: 'Various explorations and scientific curiosities.'
            },
            folderName: 'Other',
            totalEpisodes: 1
        }
    ];

    return seriesMetadata.map(series => {
        const seriesPath = path.join(PUBLICATION_DIR, series.folderName);
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

                // Check for specific files
                const mapUrl = getAssetUrl(`map_${i}.png`);
                if (mapUrl) {
                    formats.push({ type: 'Mind Map', src: mapUrl });
                }

                const graphiUrl = getAssetUrl(`graphi_${i}.png`);
                const graphUrl = getAssetUrl(`graph_${i}.png`);
                if (graphiUrl) {
                    formats.push({ type: 'Infographie', src: graphiUrl });
                } else if (graphUrl) {
                    formats.push({ type: 'Infographie', src: graphUrl });
                }

                const audioM4aUrl = getAssetUrl(`audio_${i}.m4a`);
                const audioMp4Url = getAssetUrl(`audio_${i}.mp4`);
                if (audioM4aUrl) {
                    formats.push({ type: 'Audio', src: audioM4aUrl });
                } else if (audioMp4Url) {
                    formats.push({ type: 'Audio', src: audioMp4Url });
                }

                const videoUrl = getAssetUrl(`video_${i}.mp4`);
                if (videoUrl) {
                    formats.push({ type: 'Vidéo', src: videoUrl });
                }

                const pointUrl = getAssetUrl(`point_${i}.pdf`);
                if (pointUrl) {
                    formats.push({ type: 'Point Scientifique', src: pointUrl });
                }
            }

            // Article Complet logic removed as requested for Vulgarisation page


            // Determine title and status
            let title = { fr: `${i.toString().padStart(2, '0')} — `, en: `${i.toString().padStart(2, '0')} — ` };

            if (formats.length > 0) {
                if (i === 1 && series.id === 'chronon-field') {
                    title.fr += 'Le temps qui bat';
                    title.en += 'The Beating Time';
                }
                else if (i === 2 && series.id === 'chronon-field') {
                    title.fr += 'L\'effondrement opérationnel';
                    title.en += 'Operational Collapse';
                }
                else if (i === 3 && series.id === 'chronon-field') {
                    title.fr += 'La tenue du réel';
                    title.en += 'The Holding of Reality';
                }
                else if (i === 1 && series.id === 'other') {
                    title.fr += 'Chronon & Vide : Dialogue critique';
                    title.en += 'Chronon & Void: Critical Dialogue';
                }
                else {
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

        return {
            ...series,
            articles
        };
    });
}
