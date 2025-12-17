import PageMeta from '@components/common/PageMeta';
import InfoCard from '@components/ui/InfoCard';
import FadeIn from '@components/common/FadeIn';
import { aboutData } from '@data/aboutData';

import aboutImage from '@assets/about/Nosotros.png';


const About = () => {
    return (
        <>
            <PageMeta
                title="NOSOTROS – BRIORSAL"
                description="About Briorsal"
            />

            <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-6rem)]">
                <div className="relative w-full lg:w-1/2 h-96 lg:h-auto group overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center">
                        <img
                            src={aboutImage}
                            alt="Nosotros"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute inset-0 bg-brand-dark-900/40"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-full">
                        <FadeIn
                            direction="none"
                            className="relative z-10 flex flex-col items-center justify-center h-full"
                        >
                            <h1 className="text-5xl md:text-7xl font-bold text-white uppercase mb-6 drop-shadow-lg">
                                NOSOTROS
                            </h1>
                        </FadeIn>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex items-center justify-center p-12 lg:p-24 bg-blue-bg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 w-full">
                        {aboutData.map((item, index) => (
                            <div
                                key={item.id}
                                className={
                                    item.className
                                        ? item.className
                                        : 'flex justify-center'
                                }
                            >
                                <FadeIn delay={index * 0.2} direction="up" fullWidth>
                                    <InfoCard
                                        title={item.title}
                                        description={item.description}
                                    />
                                </FadeIn>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default About;
