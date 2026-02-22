import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'vulgarisation.json');

export function getVulgarisationData() {
    if (!fs.existsSync(DATA_FILE)) {
        console.warn('data/vulgarisation.json not found, returning empty series list');
        return [];
    }

    try {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading vulgarisation data:', error);
        return [];
    }
}
