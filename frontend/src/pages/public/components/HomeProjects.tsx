import { Link } from 'react-router-dom';
import { FaArrowRight, FaBuilding, FaLocationDot } from 'react-icons/fa6';
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
    return (
        <FadeIn delay={delay} direction="up" className="h-full">
            <Link
                to={`/proyectos/${project.slug}`}
                className={`group relative block w-full h-full overflow-hidden rounded-3xl bg-slate-900 shadow-xl ${isLarge ? 'aspect-[16/9] md:aspect-[21/9]' : 'aspect-[4/5] md:aspect-[4/3]'}`}
            >
                {project.images.length > 0 ? (
                    <img
                        src={project.images[0].image}
                        alt={project.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                        loading="lazy"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-slate-600">
                        <FaBuilding size={isLarge ? 60 : 40} />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-90 transition-opacity duration-300"></div>

                <div
                    className={`absolute bottom-0 left-0 w-full ${isLarge ? 'p-8 md:p-14' : 'p-6 md:p-8'}`}
                >
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <span
                            className={`inline-block mb-3 font-bold text-white bg-orange-600 rounded-full shadow-lg shadow-orange-600/20 ${isLarge ? 'px-4 py-1.5 text-sm' : 'px-3 py-1 text-xs'}`}
                        >
                            {project.category?.name || 'Proyecto'}
                        </span>

                        <h3
                            className={`font-black text-white mb-2 leading-tight ${isLarge ? 'text-3xl md:text-5xl lg:text-6xl max-w-3xl' : 'text-xl md:text-2xl line-clamp-2'}`}
                        >
                            {project.name}
                        </h3>

                        <div
                            className={`flex items-center gap-2 text-slate-300 ${isLarge ? 'text-lg mt-4' : 'text-xs mt-2'} opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100`}
                        >
                            <FaLocationDot className="text-orange-500" />
                            {project.location || 'Ubicación no especificada'}
                        </div>
                    </div>

                    {isLarge && (
                        <div className="absolute bottom-14 right-14 w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0 transition-all duration-500">
                            <FaArrowRight
                                size={24}
                                className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                            />
                        </div>
                    )}
                </div>
            </Link>
        </FadeIn>
    );
};

export const HomeProjects = () => {
    const { data, isLoading } = useGetProjectsQuery({
        page: 1,
        pageSize: 7,
        no_page: true,
        is_featured: true,
    });

    const projects = data?.data || [];

    const heroProject = projects[0];
    const gridProjects = projects.slice(1);

    if (isLoading) return <ProjectsSkeleton />;

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <span className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-2 block">
                            Proyectos
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900">
                            Proyectos Destacados
                        </h2>
                    </div>
                    <Link
                        to="/proyectos"
                        className="group flex items-center gap-2 text-slate-900 font-bold hover:text-orange-500 transition-colors"
                    >
                        Ver todo los proyectos
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {projects.length > 0 ? (
                    <div className="space-y-8">
                        <div className="w-full">
                            <ProjectCard
                                project={heroProject}
                                isLarge={true}
                                delay={0.1}
                            />
                        </div>

                        {gridProjects.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {gridProjects.map((project, index) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        isLarge={false}
                                        delay={0.1 * (index + 2)}
                                    />
                                ))}
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
            <div className="h-10 w-1/3 bg-slate-200 rounded-lg animate-pulse mb-12"></div>
            <div className="w-full aspect-[21/9] bg-slate-200 rounded-3xl animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="aspect-[4/3] bg-slate-200 rounded-3xl animate-pulse"></div>
                <div className="aspect-[4/3] bg-slate-200 rounded-3xl animate-pulse"></div>
                <div className="aspect-[4/3] bg-slate-200 rounded-3xl animate-pulse"></div>
            </div>
        </div>
    </section>
);

const EmptyState = () => (
    <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-200 border-dashed">
        <FaBuilding className="mx-auto text-4xl text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-700 mb-2">
            Construyendo nuestro portafolio
        </h3>
        <p className="text-slate-500 font-medium">
            Pronto publicaremos nuestros proyectos destacados.
        </p>
    </div>
);
