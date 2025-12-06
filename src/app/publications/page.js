import { getPublicationsData } from '../../lib/publications';
import PublicationsClient from '../../components/PublicationsClient';

export default function Publications() {
    const publicationsData = getPublicationsData();

    return <PublicationsClient initialPublications={publicationsData} />;
}

/*
( ~ ~ ~ Φ(x) ~ ~ ~
Benjamin Brécheteau | Chronon Field 2025
~ ~ ~ ~ ~ ~ ~ ~ ~)
*/
