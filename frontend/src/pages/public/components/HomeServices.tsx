import {
    FaCompassDrafting,
    FaHelmetSafety,
    FaBuilding,
    FaScrewdriverWrench,
} from 'react-icons/fa6';
import FadeIn from '@/components/common/FadeIn';

const ServiceCard = ({ icon: Icon, title, description, delay }: any) => (
    <FadeIn delay={delay} direction="up">
        <div className="group p-8 rounded-3xl bg-white border border-slate-100 hover:border-orange-100 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors duration-300 shadow-lg shadow-slate-900/20 group-hover:shadow-orange-500/30">
                    <Icon className="text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {title}
                </h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                    {description}
                </p>
            </div>
        </div>
    </FadeIn>
);

export const HomeServices = () => {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-2 block">
                        Nuestras Especialidades
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">
                        Soluciones Integrales
                    </h2>
                    <p className="text-slate-500 text-lg">
                        Abarcamos todas las etapas del ciclo de vida de un
                        proyecto, garantizando excelencia.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <ServiceCard
                        icon={FaCompassDrafting}
                        title="Diseño Arquitectónico"
                        description="Planificación conceptual y detallada que fusiona estética funcional."
                        delay={0.1}
                    />
                    <ServiceCard
                        icon={FaHelmetSafety}
                        title="Ejecución de Obra"
                        description="Construcción civil con estándares rigurosos de seguridad y calidad."
                        delay={0.2}
                    />
                    <ServiceCard
                        icon={FaBuilding}
                        title="Gestión de Proyectos"
                        description="Supervisión técnica y control de presupuestos para obras."
                        delay={0.3}
                    />
                    <ServiceCard
                        icon={FaScrewdriverWrench}
                        title="Remodelaciones"
                        description="Transformación de espacios para optimizar su funcionalidad."
                        delay={0.4}
                    />
                </div>
            </div>
        </section>
    );
};
