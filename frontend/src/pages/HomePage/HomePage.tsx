import Clock from '../../components/Clock/Clock';
import InfoBadge from '../../components/InfoBadge/InfoBadge';
import PlaygroundGrid from '../../components/PlaygroundGrid/PlaygroundGrid';

export const HomePage = () => (
    <section>
        <PlaygroundGrid />
        <Clock />
        <InfoBadge />
    </section>
);