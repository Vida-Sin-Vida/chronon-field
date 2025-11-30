import { getPublicationsData } from '@/lib/publications';
import AboutClient from '@/components/AboutClient';

export default function About() {
    const publications = getPublicationsData();
    const publicationCount = publications.length;

    return <AboutClient publicationCount={publicationCount} />;
}
