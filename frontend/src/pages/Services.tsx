import PageMeta from '@components/common/PageMeta';
import FadeIn from '@components/common/FadeIn';
import ServiceCard from '@components/ui/ServiceCard';
import { servicesData } from '@data/servicesData';

const Services = () => {
    return (
        <>
            <PageMeta
                title="SERVICIOS – BRIORSAL"
                description="Nuestros servicios de construcción"
            />

            <div className="min-h-screen bg-blue-bg w-full flex flex-col lg:flex-row">
                <div className="w-full lg:w-1/3 p-10 lg:p-20 flex items-center justify-start lg:justify-center">
                    <FadeIn direction="right" delay={0.2}>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase leading-tight">
                            Nuestros <br />
                            <span className="text-brand-400">Servicios</span>
                        </h1>
                    </FadeIn>

                    <FadeIn direction="right" delay={0.4}>
                        <div className="mt-6 w-24 h-2 bg-brand-400 rounded-full"></div>
                    </FadeIn>
                </div>

                <div className="w-full lg:w-2/3 p-8 lg:p-20 bg-blue-bg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 max-w-5xl">
                        {servicesData.map((service, index) => (
                            <FadeIn
                                key={service.id}
                                delay={index * 0.15}
                                direction="up"
                            >
                                <ServiceCard
                                    title={service.title}
                                    description={service.description}
                                    image={service.image}
                                />
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Services;
