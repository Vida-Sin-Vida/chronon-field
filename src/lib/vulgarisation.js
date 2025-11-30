import fs from 'fs';
import path from 'path';

const PUBLICATION_DIR = path.join(process.cwd(), 'public', 'publication');

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
                if (fs.existsSync(path.join(episodePath, `audio_${i}.m4a`))) { // Note: User said .mp4 in request but file is .m4a in dir list. Checking both or sticking to what I saw.
                    formats.push({ type: 'Audio', src: `/publication/${series.folderName}/${i}/audio_${i}.m4a` });
                } else if (fs.existsSync(path.join(episodePath, `audio_${i}.mp4`))) {
                    formats.push({ type: 'Audio', src: `/publication/${series.folderName}/${i}/audio_${i}.mp4` });
                }

                if (fs.existsSync(path.join(episodePath, `video_${i}.mp4`))) {
                    formats.push({ type: 'Vidéo', src: `/publication/${series.folderName}/${i}/video_${i}.mp4` });
                }
            }

            // Determine title and status
            let title = `${i.toString().padStart(2, '0')} — `;
            if (formats.length > 0) {
                // If we have content, we might want a specific title. 
                // For now, I'll use a generic one or try to map it if I had a title map.
                // The original data had "Le temps qui bat" for ep 1.
                // I will keep a small map for known titles or default to "Episode X"
                if (i === 1 && series.id === 'chronon-field') title += 'Le temps qui bat';
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
