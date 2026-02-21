import { Suspense } from 'react';
import { getPublicationsData } from '../../lib/publications';
import PublicationsClient from '../../components/PublicationsClient';

export default function Publications() {
    const publicationsData = getPublicationsData();

    return (
        <Suspense fallback={<div className="min-h-screen pt-24 pb-12 px-6 bg-background">Loading...</div>}>
            <PublicationsClient initialPublications={publicationsData} />
        </Suspense>
    );
}

/*
( ~ ~ ~ Φ(x) ~ ~ ~
Benjamin Brécheteau | Chronon Field 2025
~ ~ ~ ~ ~ ~ ~ ~ ~)
*/
