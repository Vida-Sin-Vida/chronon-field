import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'publications.json');

export function getPublicationsData() {
    if (!fs.existsSync(DATA_FILE)) {
        console.warn('data/publications.json not found, returning empty list');
        return [];
    }

    try {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
        const publications = JSON.parse(fileContent);
        return publications;
    } catch (error) {
        console.error('Error reading publications data:', error);
        return [];
    }
}
