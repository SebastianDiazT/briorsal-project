import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    FaArrowRight,
    FaBuilding,
    FaLocationDot,
    FaChevronLeft,
    FaChevronRight,
} from 'react-icons/fa6';
import { useGetProjectsQuery } from '@/features/projects/api/projectsApi';
import FadeIn from '@/components/common/FadeIn';

const ProjectCard = ({
    project,
    isLarge = false,
    delay,
}: {
    project: any;
    isLarge?: boolean;
    delay: number;
}) => {
    const imageSrc = project.cover;
    const categoryName = project.category_names?.[0] || 'General';

    return (
        <FadeIn delay={delay} direction="up" className="h-full">
            <Link
                to={`/proyectos/${project.slug}`}
                className={`group relative block h-full overflow-hidden rounded-3xl bg-slate-900 shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1 
                ${isLarge ? 'w-full aspect-[16/9] md:aspect-[21/9]' : 'w-[280px] md:w-[350px] aspect-[3/4] flex-shrink-0'}`}
            >
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={project.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                        loading="lazy"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-slate-600">
                        <FaBuilding size={isLarge ? 60 : 40} />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-90 transition-opacity duration-300"></div>

                <div
                    className={`absolute bottom-0 left-0 w-full ${isLarge ? 'p-8 md:p-12' : 'p-6'}`}
                >
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <span
                            className={`inline-block mb-2 font-bold text-white bg-orange-600 rounded-md shadow-lg uppercase tracking-wider ${isLarge ? 'px-4 py-1.5 text-xs' : 'px-2.5 py-1 text-[10px]'}`}
                        >
                            {categoryName}
                        </span>

                        <h3
                            className={`font-black text-white mb-1 leading-tight ${isLarge ? 'text-3xl md:text-5xl max-w-4xl' : 'text-xl line-clamp-2'}`}
                        >
                            {project.name}
                        </h3>

                        <div
                            className={`flex items-center gap-2 text-slate-300 ${isLarge ? 'text-lg mt-4' : 'text-xs mt-2'} opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100`}
                        >
                            <FaLocationDot className="text-orange-500" />
                            <span className="truncate">
                                {project.location ||
                                    'Ubicación no especificada'}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </FadeIn>
    );
};

export const HomeProjects = () => {
    const { data, isLoading } = useGetProjectsQuery({
        page: 1,
        pageSize: 20,
        no_page: true,
        is_featured: true,
    });

    const projects = data?.data || [];
    const sliderRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (sliderRef.current) {
            const { current } = sliderRef;
            const scrollAmount = 350;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    if (isLoading) return <ProjectsSkeleton />;

    return (
        <section className="py-24 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <FadeIn direction="right">
                        <div>
                            <span className="text-orange-500 font-bold tracking-widest uppercase text-xs md:text-sm mb-2 block">
                                Portafolio Selecto
                            </span>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                                Proyectos <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
                                    Destacados
                                </span>
                            </h2>
                        </div>
                    </FadeIn>

                    <FadeIn direction="left">
                        <div className="flex items-center gap-4">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => scroll('left')}
                                    className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95"
                                    aria-label="Anterior"
                                >
                                    <FaChevronLeft />
                                </button>
                                <button
                                    onClick={() => scroll('right')}
                                    className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95"
                                    aria-label="Siguiente"
                                >
                                    <FaChevronRight />
                                </button>
                            </div>

                            <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>

                            <Link
                                to="/proyectos"
                                className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-orange-600 transition-colors uppercase tracking-wider"
                            >
                                Ver Todo
                                <FaArrowRight />
                            </Link>
                        </div>
                    </FadeIn>
                </div>

                {projects.length > 0 ? (
                    <div className="space-y-12">
                        <div className="w-full">
                            <ProjectCard
                                project={projects[0]}
                                isLarge={true}
                                delay={0.1}
                            />
                        </div>

                        {projects.length > 1 && (
                            <div className="relative -mx-4 px-4 md:mx-0 md:px-0">
                                <div
                                    ref={sliderRef}
                                    className="flex gap-6 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory scrollbar-hide"
                                    style={{
                                        scrollbarWidth: 'none',
                                        msOverflowStyle: 'none',
                                    }}
                                >
                                    {projects.slice(1).map((project, index) => (
                                        <div
                                            key={project.id}
                                            className="snap-start"
                                        >
                                            <ProjectCard
                                                project={project}
                                                isLarge={false}
                                                delay={0.1 + index * 0.05}
                                            />
                                        </div>
                                    ))}

                                    <Link
                                        to="/proyectos"
                                        className="min-w-[200px] flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-slate-300 text-slate-400 hover:text-orange-500 hover:border-orange-500 hover:bg-orange-50 transition-all group snap-start"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <FaArrowRight size={20} />
                                        </div>
                                        <span className="font-bold text-sm">
                                            Ver todos los proyectos
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <EmptyState />
                )}
            </div>
        </section>
    );
};

const ProjectsSkeleton = () => (
    <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 space-y-8">
            <div className="flex justify-between items-end mb-12">
                <div className="space-y-3 w-1/2">
                    <div className="h-4 w-32 bg-slate-200 rounded-full animate-pulse"></div>
                    <div className="h-12 w-full max-w-md bg-slate-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="flex gap-2">
                    <div className="h-12 w-12 rounded-full bg-slate-200 animate-pulse"></div>
                    <div className="h-12 w-12 rounded-full bg-slate-200 animate-pulse"></div>
                </div>
            </div>

            <div className="w-full aspect-[21/9] bg-slate-200 rounded-3xl animate-pulse"></div>

            <div className="flex gap-6 overflow-hidden">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="w-[300px] aspect-[3/4] bg-slate-200 rounded-3xl animate-pulse flex-shrink-0"
                    ></div>
                ))}
            </div>
        </div>
    </section>
);

const EmptyState = () => (
    <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-slate-200 border-dashed">
        <FaBuilding className="mx-auto text-5xl text-slate-300 mb-6" />
        <h3 className="text-2xl font-bold text-slate-700 mb-2">
            Construyendo nuestro portafolio
        </h3>
        <p className="text-slate-500 font-medium max-w-md mx-auto">
            Estamos seleccionando nuestros mejores proyectos para mostrártelos
            aquí muy pronto.
        </p>
    </div>
);
