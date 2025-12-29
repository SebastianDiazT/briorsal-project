import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchServices } from '@store/slices/companySlice';

import PageMeta from '@components/common/PageMeta';
import FadeIn from '@components/common/FadeIn';
import ServiceCard from '@features/company/components/ServiceCard';

const Services = () => {
    const dispatch = useAppDispatch();
    const { services, loading } = useAppSelector((state) => state.company);

    useEffect(() => {
        if (services.length === 0) {
            dispatch(fetchServices({ page: 1, pageSize: 12 }));
        }
    }, [dispatch, services.length]);

    return (
        <>
            <PageMeta
                title="SERVICIOS – BRIORSAL CONSTRUCTORA"
                description="Conoce nuestros servicios especializados en construcción, diseño y arquitectura."
            />

            <div className="min-h-screen bg-blue-bg w-full flex flex-col lg:flex-row relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-bg skew-x-12 translate-x-32 pointer-events-none"></div>

                <div className="w-full lg:w-1/3 lg:h-screen lg:sticky lg:top-0 p-10 lg:p-20 flex flex-col justify-center bg-blue-bg z-10 items-center text-center lg:items-start lg:text-left">
                    <FadeIn direction="right" delay={0.2}>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white uppercase leading-tight tracking-tight">
                            Nuestros <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-200">
                                Servicios
                            </span>
                        </h1>
                    </FadeIn>

                    <FadeIn direction="right" delay={0.4}>
                        <div className="mt-8 w-32 h-2 bg-btm"></div>
                    </FadeIn>
                </div>

                <div className="w-full lg:w-2/3 p-8 lg:p-24 bg-blue-bg z-10">
                    {loading ? (
                        <div className="flex h-full items-center justify-center">
                            <div className="text-white text-xl animate-pulse">
                                Cargando servicios...
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
                            {services.map((service, index) => (
                                <FadeIn
                                    key={service.id}
                                    delay={index * 0.15}
                                    direction="up"
                                    className="h-full"
                                >
                                    <ServiceCard
                                        title={service.title}
                                        description={service.description}
                                        image={service.image}
                                    />
                                </FadeIn>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Services;
