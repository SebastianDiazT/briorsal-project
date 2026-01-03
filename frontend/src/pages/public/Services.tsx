import { Link } from 'react-router-dom';
import { FaArrowRight, FaHardHat } from 'react-icons/fa';
import { useGetServicesQuery } from '@/features/services/api/servicesApi';

import PageMeta from '@/components/common/PageMeta';
import FadeIn from '@/components/common/FadeIn';
import ServiceCard from '@/features/services/components/public/ServiceCard';

const Services = () => {
    const { data: response, isLoading } = useGetServicesQuery({
        no_page: true,
    });

    const services = response?.data || [];

    return (
        <>
            <PageMeta
                title="SERVICIOS – BRIORSAL CONSTRUCTORA"
                description="Soluciones integrales en construcción, diseño arquitectónico y gestión de proyectos."
            />

            <div className="min-h-screen bg-slate-900 w-full flex flex-col lg:flex-row lg:items-center relative overflow-hidden font-sans">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute -top-[10%] -left-[5%] w-[60vw] h-[60vw] bg-blue-900/20 rounded-full blur-[120px] mix-blend-screen"></div>
                    <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-orange-900/10 rounded-full blur-[100px] mix-blend-screen"></div>
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                </div>

                <div className="w-full lg:w-[40%] p-8 md:p-16 lg:p-24 flex flex-col justify-center z-10 relative self-center">
                    <FadeIn direction="down" delay={0.1}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold tracking-wider uppercase mb-8">
                            <FaHardHat /> Excelencia Técnica
                        </div>
                    </FadeIn>

                    <FadeIn direction="right" delay={0.2}>
                        <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-white leading-[0.9] tracking-tight mb-8 uppercase">
                            Nuestros <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-200">
                                Servicios
                            </span>
                        </h1>
                    </FadeIn>

                    <FadeIn direction="right" delay={0.3}>
                        <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-md mb-12 font-light text-justify">
                            Transformamos ideas complejas en estructuras
                            tangibles. Cada servicio está respaldado por años de
                            experiencia y un compromiso inquebrantable con la
                            calidad.
                        </p>
                    </FadeIn>

                    <FadeIn direction="up" delay={0.4}>
                        <Link
                            to="/nosotros"
                            className="group inline-flex items-center gap-3 text-white font-bold text-lg hover:text-orange-400 transition-all uppercase tracking-widest"
                        >
                            <span className="border-b-2 border-orange-500 pb-2 group-hover:border-orange-400 transition-all">
                                Conócenos más
                            </span>
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </FadeIn>
                </div>

                <div className="w-full lg:w-[60%] p-6 md:p-12 lg:p-24 z-10">
                    {isLoading ? (
                        <ServicesSkeletonGrid />
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
                                        title={service.name}
                                        description={service.description}
                                        image={service.image}
                                    />
                                </FadeIn>
                            ))}
                        </div>
                    )}

                    {!isLoading && services.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                            <FaHardHat size={48} className="mb-4 opacity-20" />
                            <p className="text-xl font-light uppercase tracking-widest italic text-center">
                                Próximamente nuevos servicios
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

const ServicesSkeletonGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col animate-pulse">
                <div className="h-64 w-full bg-slate-800 rounded-sm mb-8 shadow-xl"></div>
                <div className="h-8 w-3/4 bg-slate-800 mb-4 rounded-sm"></div>
                <div className="w-12 h-1 bg-slate-800 mb-5"></div>
                <div className="space-y-2">
                    <div className="h-4 w-full bg-slate-800 rounded-sm opacity-50"></div>
                    <div className="h-4 w-5/6 bg-slate-800 rounded-sm opacity-50"></div>
                </div>
            </div>
        ))}
    </div>
);

export default Services;
