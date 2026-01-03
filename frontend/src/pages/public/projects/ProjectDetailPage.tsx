import { useParams, Link } from 'react-router-dom';
import {
    FaMapMarkerAlt,
    FaArrowLeft,
    FaSpinner,
    FaBuilding,
} from 'react-icons/fa';

import { useGetProjectBySlugQuery } from '@/features/projects/api/projectsApi';
import { ProjectSpecs } from '@features/projects/components/public/ProjectSpecs';
import { ProjectGallery } from '@features/projects/components/public/ProjectGallery';
import PageMeta from '@components/common/PageMeta';

const ProjectDetailPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const { data: project, isLoading } = useGetProjectBySlugQuery(slug!);

    if (isLoading)
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
                <FaSpinner className="animate-spin text-5xl text-orange-500 mb-4" />
                <p className="text-slate-400 font-medium animate-pulse">
                    Cargando proyecto...
                </p>
            </div>
        );

    if (!project)
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
                <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-6">
                    <FaBuilding size={32} />
                </div>
                <h1 className="text-2xl font-bold text-slate-700 mb-2">
                    Proyecto no encontrado
                </h1>
                <Link
                    to="/proyectos"
                    className="text-orange-600 hover:underline font-medium"
                >
                    Volver al portafolio
                </Link>
            </div>
        );

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
                title={`${project.name} | Grupo Briorsal`}
                description={
                    project.description
                        ? project.description.substring(0, 160)
                        : `Detalles del proyecto ${project.name} ubicado en ${project.location}`
                }
            />

            <div className="bg-white min-h-screen pb-24">
                <div className="relative h-[55vh] md:h-[70vh] w-full overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-fixed transform scale-105"
                        style={{ backgroundImage: `url(${coverImage})` }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/30" />

                    <div className="absolute inset-0 container mx-auto px-4 flex flex-col justify-end pb-16">
                        <Link
                            to="/proyectos"
                            className="text-white/70 hover:text-white flex items-center gap-2 mb-8 font-medium transition-all hover:-translate-x-1 w-fit group"
                        >
                            <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                                <FaArrowLeft size={14} />
                            </div>
                            Volver al Portafolio
                        </Link>

                        <div className="animate-fade-in-up max-w-5xl">
                            <div className="flex flex-wrap gap-3 mb-5">
                                <span className="px-4 py-1.5 bg-orange-600 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-orange-900/20">
                                    {project.category_name}
                                </span>
                                {project.status === 'en_proceso' && (
                                    <span className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                                        En Construcción
                                    </span>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
                                {project.name}
                            </h1>

                            <div className="flex items-center gap-3 text-slate-200 font-medium text-lg md:text-xl backdrop-blur-sm bg-white/5 w-fit px-4 py-2 rounded-lg border border-white/10">
                                <FaMapMarkerAlt className="text-orange-500" />
                                {project.location}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 -mt-10 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        <div className="lg:col-span-8 bg-white rounded-t-3xl p-6 md:p-10 shadow-xl shadow-slate-200/50 min-h-[400px]">
                            {hasDescription && (
                                <div className="mb-16">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
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
                            )}

                            {hasMedia && (
                                <div>
                                    <ProjectGallery project={project} />
                                </div>
                            )}

                            {!hasDescription && !hasMedia && (
                                <div className="text-center py-20 text-slate-400 italic">
                                    No hay información detallada disponible para
                                    este proyecto aún.
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-4">
                            <div className="sticky top-28 space-y-8">
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
