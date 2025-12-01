import fs from 'fs';
import path from 'path';

const PUBLICATION_DIR = path.join(process.cwd(), 'public', 'publication');
const DOCUMENTS_DIR = path.join(process.cwd(), 'public', 'document');

export function getVulgarisationData() {
    // Define series metadata statically as requested, but scan for content
    const seriesMetadata = [
        {
            id: 'chronon-field',
            title: 'The Chronon Field Series',
            description: 'Une plongée au cœur de la théorie du champ de chronon.',
            folderName: 'chronon_field_serie',
            totalEpisodes: 12 // As per original data
        },
        {
            id: 'other',
            title: 'Other',
            description: 'Explorations diverses et curiosités scientifiques.',
            folderName: 'other',
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
                // Check for specific files
                if (fs.existsSync(path.join(episodePath, `map_${i}.png`))) {
                    formats.push({ type: 'Mind Map', src: `/publication/${series.folderName}/${i}/map_${i}.png` });
                }
                if (fs.existsSync(path.join(episodePath, `graphi_${i}.png`))) {
                    formats.push({ type: 'Infographie', src: `/publication/${series.folderName}/${i}/graphi_${i}.png` });
                }
                if (fs.existsSync(path.join(episodePath, `audio_${i}.m4a`))) {
                    formats.push({ type: 'Audio', src: `/publication/${series.folderName}/${i}/audio_${i}.m4a` });
                } else if (fs.existsSync(path.join(episodePath, `audio_${i}.mp4`))) {
                    formats.push({ type: 'Audio', src: `/publication/${series.folderName}/${i}/audio_${i}.mp4` });
                }

                if (fs.existsSync(path.join(episodePath, `video_${i}.mp4`))) {
                    formats.push({ type: 'Vidéo', src: `/publication/${series.folderName}/${i}/video_${i}.mp4` });
                }

                if (fs.existsSync(path.join(episodePath, `point_${i}.pdf`))) {
                    formats.push({ type: 'Point Scientifique', src: `/publication/${series.folderName}/${i}/point_${i}.pdf` });
                }
            }

            // Check for associated full article in public/document
            // Pattern: chronon_field_serie_{i}_en.pdf or similar
            // We'll check for both EN and FR
            const articleEn = `chronon_field_serie_${i}_en.pdf`;
            const articleFr = `chronon_field_serie_${i}_fr.pdf`;

            if (fs.existsSync(path.join(DOCUMENTS_DIR, articleEn))) {
                formats.push({ type: 'Article Complet (EN)', src: `/document/${articleEn}` });
            } else if (fs.existsSync(path.join(DOCUMENTS_DIR, articleFr))) {
                formats.push({ type: 'Article Complet (FR)', src: `/document/${articleFr}` });
            }


            // Determine title and status
            let title = `${i.toString().padStart(2, '0')} — `;
            if (formats.length > 0) {
                if (i === 1 && series.id === 'chronon-field') title += 'Le temps qui bat';
                else if (i === 2 && series.id === 'chronon-field') title += 'L\'effondrement opérationnel';
                else title += 'Episode ' + i;
            } else {
                title += 'A venir';
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
