import { useParams, Link } from 'react-router-dom';
import {
    FaLocationDot,
    FaArrowLeft,
    FaBuilding,
} from 'react-icons/fa6';

import { useGetProjectBySlugQuery } from '@/features/projects/api/projectsApi';
import { ProjectSpecs } from '@/features/projects/components/public/ProjectSpecs';
import { ProjectGallery } from '@/features/projects/components/public/ProjectGallery';
import PageMeta from '@/components/common/PageMeta';
import FadeIn from '@/components/common/FadeIn';

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

    const coverImage =
        project.images.length > 0
            ? project.images[0].image
            : '/placeholder.jpg';
    const hasDescription =
        project.description && project.description.trim().length > 0;
    const hasMedia = project.images.length > 0 || project.videos.length > 0;

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

            <div className="bg-white min-h-screen pb-24">
                <div className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden bg-slate-900">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-fixed transform scale-105 opacity-80"
                        style={{ backgroundImage: `url(${coverImage})` }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />

                    <div className="absolute inset-0 container mx-auto px-4 flex flex-col justify-end pb-16 md:pb-24">
                        <FadeIn direction="down">
                            <Link
                                to="/proyectos"
                                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 font-bold transition-colors group backdrop-blur-md bg-white/5 px-4 py-2 rounded-full w-fit hover:bg-white/10"
                            >
                                <div className="p-1 rounded-full bg-white/20 group-hover:bg-orange-500 transition-colors">
                                    <FaArrowLeft size={12} />
                                </div>
                                Volver al Portafolio
                            </Link>
                        </FadeIn>

                        <div className="max-w-4xl">
                            <FadeIn delay={0.1} direction="up">
                                <div className="flex flex-wrap gap-3 mb-6">
                                    <span className="px-4 py-1.5 bg-orange-600 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-orange-900/20">
                                        {project.category_name || 'Proyecto'}
                                    </span>
                                    {project.status === 'en_proceso' && (
                                        <span className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                                            En Construcción
                                        </span>
                                    )}
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.2} direction="up">
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] drop-shadow-xl">
                                    {project.name}
                                </h1>
                            </FadeIn>

                            <FadeIn delay={0.3} direction="up">
                                <div className="flex items-center gap-3 text-slate-200 font-medium text-lg md:text-xl backdrop-blur-md bg-white/5 w-fit px-5 py-3 rounded-xl border border-white/10">
                                    <FaLocationDot className="text-orange-500" />
                                    {project.location}
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 -mt-12 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        <div className="lg:col-span-8 bg-white rounded-t-3xl md:rounded-3xl p-6 md:p-10 shadow-2xl shadow-slate-200/50 min-h-[400px]">
                            {hasDescription ? (
                                <div className="mb-16">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                                        <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
                                        Sobre el Proyecto
                                    </h2>
                                    <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed text-justify">
                                        {project.description.split('\n').map(
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
                                </div>
                            ) : (
                                !hasMedia && (
                                    <div className="text-center py-20 text-slate-400 italic bg-slate-50 rounded-2xl">
                                        No hay información detallada disponible
                                        para este proyecto aún.
                                    </div>
                                )
                            )}

                            {hasMedia && (
                                <div className="animate-fade-in-up">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3 border-b border-slate-100 pb-4">
                                        <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
                                        Galería Visual
                                    </h2>
                                    <ProjectGallery project={project} />
                                </div>
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
