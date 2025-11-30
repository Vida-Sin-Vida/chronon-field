import { getVulgarisationData } from '../../lib/vulgarisation';
import VulgarisationClient from '../../components/VulgarisationClient';

export default function Vulgarisation() {
    const seriesData = getVulgarisationData();

    return <VulgarisationClient series={seriesData} />;
}
