import PageMeta from '@/components/common/PageMeta';
import ClientsMarquee from '@/features/clients/components/public/ClientsMarquee';

import { HomeHero } from './components/HomeHero';
import { HomeStats } from './components/HomeStats';
import { HomeServices } from './components/HomeServices';
import { HomeProjects } from './components/HomeProjects';
import { HomeCTA } from './components/HomeCTA';

const Home = () => {
    return (
        <>
            <PageMeta
                title="INICIO – BRIORSAL CONSTRUCTORA"
                description="Líderes en construcción, diseño y ejecución de proyectos de alto impacto."
            />

            <main>
                <HomeHero />
                <HomeStats />
                <HomeServices />
                <HomeProjects />{' '}
                <ClientsMarquee />
                <HomeCTA />
            </main>
        </>
    );
};

export default Home;
