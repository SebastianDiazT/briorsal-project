import PageMeta from '@/components/common/PageMeta';
import ClientsMarquee from '@/features/clients/components/public/ClientsMarquee';

import { CompanySchema } from '@/components/common/CompanySchema';

import { HomeHero } from './components/HomeHero';
import { HomeStats } from './components/HomeStats';
import { HomeServices } from './components/HomeServices';
import { HomeProjects } from './components/HomeProjects';
import { HomeCTA } from './components/HomeCTA';

const Home = () => {
    return (
        <>
            <PageMeta
                title="Briorsal Constructora | Diseño y Construcción en Arequipa"
                description="Constructora en Arequipa especializada en viviendas y proyectos multifamiliares. Visítanos en Umacollo o contáctanos al 970 507 372."
            />

            <CompanySchema />

            <main>
                <HomeHero />
                <HomeStats />
                <HomeServices />
                <HomeProjects />
                <ClientsMarquee />
                <HomeCTA />
            </main>
        </>
    );
};

export default Home;
