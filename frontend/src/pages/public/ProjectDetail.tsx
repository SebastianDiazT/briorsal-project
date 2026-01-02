import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
    fetchProjectBySlug,
    clearCurrentProject,
} from '@store/slices/projectSlice';
import {
    FaMapMarkerAlt,
    FaRulerCombined,
    FaBuilding,
    FaArrowLeft,
    FaCheckCircle,
    FaVideo,
    FaInfoCircle,
    FaTimes,
    FaExpand,
} from 'react-icons/fa';
import PageMeta from '@components/common/PageMeta';

const ProjectDetail = () => {
    const { slug } = useParams();
    const dispatch = useAppDispatch();
    const { currentProject, loading } = useAppSelector(
        (state) => state.projects
    );

    // Estado para el Modal de Pantalla Completa
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    useEffect(() => {
        if (slug) dispatch(fetchProjectBySlug(slug));
        return () => {
            dispatch(clearCurrentProject());
        };
    }, [dispatch, slug]);

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    if (!currentProject) return null;

    return (
        <>
            <PageMeta
                title={currentProject.name}
                description={currentProject.location}
            />

            {/* Modal Lightbox (Pantalla Completa) */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setLightboxImage(null)}
                >
                    <button className="absolute top-4 right-4 text-white hover:text-brand-500 transition-colors">
                        <FaTimes size={30} />
                    </button>
                    <img
                        src={lightboxImage}
                        alt="Full Screen"
                        className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl"
                        onClick={(e) => e.stopPropagation()} // Evitar cerrar al hacer clic en la imagen
                    />
                </div>
            )}

            <div className="bg-white min-h-screen pb-20">
                {/* Header Compacto */}
                <div className="bg-slate-900 text-white py-12 px-4 shadow-lg">
                    <div className="max-w-7xl mx-auto">
                        <Link
                            to="/projects"
                            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm font-bold uppercase tracking-wider"
                        >
                            <FaArrowLeft /> Volver al Portafolio
                        </Link>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2">
                                    {currentProject.name}
                                </h1>
                                <div className="flex items-center gap-2 text-brand-400 font-medium">
                                    <FaMapMarkerAlt /> {currentProject.location}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <span className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-bold backdrop-blur-md border border-white/10">
                                    {currentProject.category_name}
                                </span>
                                <span
                                    className={`px-4 py-2 rounded-lg text-sm font-bold border ${currentProject.status === 'In Progress' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-green-500/20 text-green-300 border-green-500/30'}`}
                                >
                                    {currentProject.status === 'In Progress'
                                        ? 'En Ejecución'
                                        : 'Entregado'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* --- COLUMNA IZQUIERDA: INFORMACIÓN (4 columnas) --- */}
                        <div className="lg:col-span-4 space-y-8 h-fit lg:sticky lg:top-8">
                            {/* Descripción */}
                            <div className="prose prose-slate text-slate-600 leading-relaxed">
                                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                                    <FaInfoCircle className="text-brand-500" />{' '}
                                    Descripción
                                </h3>
                                <p className="whitespace-pre-line">
                                    {currentProject.extra_info ||
                                        'Sin descripción detallada.'}
                                </p>
                            </div>

                            {/* Ficha Técnica */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
                                    Ficha Técnica
                                </h3>
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between py-2 border-b border-slate-200">
                                        <span className="flex items-center gap-2 text-slate-600">
                                            <FaBuilding className="text-brand-500" />{' '}
                                            Tipo
                                        </span>
                                        <span className="font-bold text-slate-800">
                                            {currentProject.service_type || '-'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-slate-200">
                                        <span className="flex items-center gap-2 text-slate-600">
                                            <FaRulerCombined className="text-brand-500" />{' '}
                                            Área
                                        </span>
                                        <span className="font-bold text-slate-800">
                                            {currentProject.area
                                                ? `${currentProject.area} m²`
                                                : '-'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-slate-200">
                                        <span className="flex items-center gap-2 text-slate-600">
                                            <FaBuilding className="text-brand-500" />{' '}
                                            Niveles
                                        </span>
                                        <span className="font-bold text-slate-800">
                                            {currentProject.levels || '-'}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <Link
                                        to="/contact"
                                        className="block w-full py-3 bg-brand-600 text-white text-center font-bold rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20"
                                    >
                                        Cotizar Proyecto Similar
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* --- COLUMNA DERECHA: GALERÍA MASONRY (8 columnas) --- */}
                        <div className="lg:col-span-8 space-y-12">
                            {/* Galería de Imágenes (Masonry) */}
                            {currentProject.images.length > 0 ? (
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <FaCheckCircle className="text-brand-500" />{' '}
                                        Galería Fotográfica
                                    </h3>
                                    {/* CSS Columns para efecto Masonry */}
                                    <div className="columns-1 sm:columns-2 gap-4 space-y-4">
                                        {currentProject.images.map((img) => (
                                            <div
                                                key={img.id}
                                                className="break-inside-avoid relative group rounded-xl overflow-hidden cursor-zoom-in shadow-sm hover:shadow-xl transition-all"
                                                onClick={() =>
                                                    setLightboxImage(img.image)
                                                }
                                            >
                                                <img
                                                    src={img.image}
                                                    alt="Project"
                                                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                                    <FaExpand
                                                        className="text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 drop-shadow-md"
                                                        size={32}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center text-slate-400">
                                    No hay imágenes disponibles para este
                                    proyecto.
                                </div>
                            )}

                            {/* Sección de Videos */}
                            {currentProject.videos.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <FaVideo className="text-brand-500" />{' '}
                                        Recorrido Virtual
                                    </h3>
                                    <div className="grid grid-cols-1 gap-6">
                                        {currentProject.videos.map((vid) => (
                                            <div
                                                key={vid.id}
                                                className="bg-black rounded-2xl overflow-hidden shadow-lg aspect-video"
                                            >
                                                <video
                                                    src={vid.video}
                                                    controls
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProjectDetail;
