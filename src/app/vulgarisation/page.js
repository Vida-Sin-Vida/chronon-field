import { getVulgarisationData } from '../../lib/vulgarisation';
import VulgarisationClient from '../../components/VulgarisationClient';

export default function Vulgarisation() {
    const seriesData = getVulgarisationData();

    return <VulgarisationClient series={seriesData} />;
}

/*
( ~ ~ ~ Φ(x) ~ ~ ~
Benjamin Brécheteau | Chronon Field 2025
~ ~ ~ ~ ~ ~ ~ ~ ~)
*/
