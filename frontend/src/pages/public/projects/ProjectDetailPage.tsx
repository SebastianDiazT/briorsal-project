import { useParams, Link } from 'react-router-dom';
import {
    FaLocationDot,
    FaArrowLeft,
    FaBuilding,
    FaArrowRight,
    FaLayerGroup,
    FaEye,
} from 'react-icons/fa6';

import { useGetProjectBySlugQuery } from '@/features/projects/api/projectsApi';
import { ProjectSpecs } from '@/features/projects/components/public/ProjectSpecs';
import { ProjectGallery } from '@/features/projects/components/public/ProjectGallery';
import PageMeta from '@/components/common/PageMeta';
import FadeIn from '@/components/common/FadeIn';

const RelatedProjectCard = ({ project }: { project: any }) => {
    return (
        <Link
            to={`/proyectos/${project.slug}`}
            className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100"
        >
            <div className="relative h-48 overflow-hidden">
                {project.cover ? (
                    <img
                        src={project.cover}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                        <FaBuilding size={32} />
                    </div>
                )}

                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {project.category_names
                        ?.slice(0, 1)
                        .map((cat: string, idx: number) => (
                            <span
                                key={idx}
                                className="bg-orange-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider"
                            >
                                {cat}
                            </span>
                        ))}
                </div>
            </div>

            <div className="p-5">
                <h4 className="font-bold text-slate-800 text-lg leading-tight mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {project.name}
                </h4>
                <div className="flex items-center justify-between mt-4 text-xs font-medium text-slate-500 border-t border-slate-100 pt-3">
                    <span className="flex items-center gap-1.5">
                        <FaLayerGroup className="text-orange-500" />
                        {project.year || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Ver Detalles <FaArrowRight size={10} />
                    </span>
                </div>
            </div>
        </Link>
    );
};

const ProjectDetailPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const { data: project, isLoading } = useGetProjectBySlugQuery(slug!);

    if (isLoading) {
        return (
            <div className="h-screen w-full bg-slate-900 flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium animate-pulse">
                    Cargando proyecto...
                </p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
                <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-6">
                    <FaBuilding size={40} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                    Proyecto no encontrado
                </h1>
                <p className="text-slate-500 mb-8">
                    Es posible que el enlace esté roto o el proyecto haya sido
                    eliminado.
                </p>
                <Link
                    to="/proyectos"
                    className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
                >
                    Volver al portafolio
                </Link>
            </div>
        );
    }

    const heroImage = project.banner_image_url || project.cover_image_url;
    const hasDescription =
        project.description && project.description.trim().length > 0;
    const hasMedia =
        (project.images && project.images.length > 0) ||
        (project.videos && project.videos.length > 0);
    const hasRelated =
        project.related_projects && project.related_projects.length > 0;

    const categoryCounts = project.related_projects.reduce(
        (acc: Record<string, number>, curr: any) => {
            const cat = curr.category_names?.[0] || 'uncategorized';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        },
        {}
    );

    return (
        <>
            <PageMeta
                title={`${project.name} – BRIORSAL CONSTRUCTORA`}
                description={
                    project.description
                        ? project.description.substring(0, 160)
                        : `Detalles del proyecto ${project.name}`
                }
            />

            <div className="bg-slate-50 min-h-screen pb-24">
                <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden bg-slate-900">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
                        style={{ backgroundImage: `url(${heroImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-transparent" />

                    <div className="absolute inset-0 container mx-auto px-4 flex flex-col justify-end pb-16 md:pb-20">
                        <FadeIn direction="down">
                            <Link
                                to="/proyectos"
                                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 font-bold transition-colors group backdrop-blur-md bg-white/10 px-5 py-2.5 rounded-full w-fit hover:bg-white/20 border border-white/10"
                            >
                                <FaArrowLeft
                                    size={12}
                                    className="group-hover:-translate-x-1 transition-transform"
                                />
                                Volver al Portafolio
                            </Link>
                        </FadeIn>

                        <div className="max-w-5xl">
                            <FadeIn delay={0.1} direction="up">
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    {project.categories &&
                                    project.categories.length > 0 ? (
                                        project.categories.map((cat) => (
                                            <span
                                                key={cat.id}
                                                className="px-4 py-1.5 bg-orange-600 text-white text-xs font-bold uppercase tracking-widest rounded-md shadow-lg shadow-orange-900/20"
                                            >
                                                {cat.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="px-4 py-1.5 bg-orange-600 text-white text-xs font-bold uppercase tracking-widest rounded-md shadow-lg">
                                            Proyecto
                                        </span>
                                    )}

                                    {project.status === 'en_proceso' && (
                                        <span className="px-4 py-1.5 bg-blue-600/90 backdrop-blur text-white text-xs font-bold uppercase tracking-widest rounded-md shadow-lg border border-blue-400/30">
                                            En Construcción
                                        </span>
                                    )}

                                    {hasRelated &&
                                        project.related_projects.map(
                                            (related) => {
                                                const catName =
                                                    related.category_names?.[0];
                                                const useCategoryLabel =
                                                    catName &&
                                                    categoryCounts[catName] ===
                                                        1;

                                                const labelText =
                                                    useCategoryLabel
                                                        ? `Ver ${catName}`
                                                        : `Ver ${related.name}`;

                                                return (
                                                    <Link
                                                        key={related.id}
                                                        to={`/proyectos/${related.slug}`}
                                                        className="group flex items-center gap-2 px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-widest rounded-md transition-all duration-300 backdrop-blur-md hover:border-white shadow-lg max-w-[250px]"
                                                        title={related.name}
                                                    >
                                                        <FaEye
                                                            size={12}
                                                            className="text-slate-300 group-hover:text-white transition-colors shrink-0"
                                                        />
                                                        <span className="truncate">
                                                            {labelText}
                                                        </span>
                                                    </Link>
                                                );
                                            }
                                        )}
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.2} direction="up">
                                <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                                    {project.name}
                                </h1>
                            </FadeIn>

                            <FadeIn delay={0.3} direction="up">
                                <div className="flex items-center gap-3 text-slate-200 font-medium text-lg md:text-xl backdrop-blur-md bg-white/5 w-fit px-5 py-3 rounded-xl border border-white/10 shadow-sm">
                                    <FaLocationDot className="text-orange-500" />
                                    {project.location}
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 -mt-10 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        <div className="lg:col-span-8 space-y-12">
                            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                                {hasDescription ? (
                                    <>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3 border-b border-slate-100 pb-4">
                                            <span className="w-1.5 h-8 bg-orange-500 rounded-full"></span>
                                            Sobre el Proyecto
                                        </h2>
                                        <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed text-justify">
                                            {project
                                                .description!.split('\n')
                                                .map(
                                                    (p, idx) =>
                                                        p.trim() && (
                                                            <p
                                                                key={idx}
                                                                className="mb-4 last:mb-0"
                                                            >
                                                                {p}
                                                            </p>
                                                        )
                                                )}
                                        </div>
                                    </>
                                ) : (
                                    !hasMedia && (
                                        <div className="text-center py-16 text-slate-400 italic">
                                            No hay información detallada
                                            disponible.
                                        </div>
                                    )
                                )}
                            </div>

                            {hasMedia && (
                                <FadeIn direction="up">
                                    <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3 border-b border-slate-100 pb-4">
                                            <span className="w-1.5 h-8 bg-orange-500 rounded-full"></span>
                                            Galería Visual
                                        </h2>
                                        <ProjectGallery project={project} />
                                    </div>
                                </FadeIn>
                            )}

                            {hasRelated && (
                                <FadeIn direction="up">
                                    <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3 border-b border-slate-100 pb-4">
                                            <span className="w-1.5 h-8 bg-orange-500 rounded-full"></span>
                                            Más de este desarrollo
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            {project.related_projects.map(
                                                (related) => (
                                                    <RelatedProjectCard
                                                        key={related.id}
                                                        project={related}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                </FadeIn>
                            )}
                        </div>

                        <div className="lg:col-span-4">
                            <div className="sticky top-28 space-y-8 animate-fade-in-up delay-100">
                                <ProjectSpecs project={project} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProjectDetailPage;
