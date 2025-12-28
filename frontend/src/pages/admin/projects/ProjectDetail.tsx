import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    FaArrowLeft,
    FaEdit,
    FaMapMarkerAlt,
    FaLayerGroup,
    FaBuilding,
} from 'react-icons/fa';
import { IoResize } from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProjectBySlug } from '../../../store/slices/projectSlice';

const ProjectDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentProject, loading, error } = useAppSelector(
        (state) => state.projects
    );

    useEffect(() => {
        if (slug) dispatch(fetchProjectBySlug(slug));
    }, [dispatch, slug]);

    if (loading)
        return <div className="p-10 text-center">Cargando detalles...</div>;
    if (error || !currentProject)
        return (
            <div className="p-10 text-center text-red-500">
                Error: {error || 'Proyecto no encontrado'}
            </div>
        );

    return (
        <div className="max-w-5xl mx-auto animate-fade-in-up">
            {/* HEADER DE NAVEGACIÓN */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate('/admin/projects')}
                    className="flex items-center gap-2 text-slate-500 hover:text-brand-600 font-medium transition-colors"
                >
                    <FaArrowLeft /> Volver a lista
                </button>
                <Link
                    to={`/admin/projects/edit/${currentProject.slug}`}
                    className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-100 transition-colors"
                >
                    <FaEdit /> Editar Proyecto
                </Link>
            </div>

            {/* PORTADA GRANDE */}
            <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-lg mb-8 bg-slate-200">
                {currentProject.images && currentProject.images.length > 0 ? (
                    <img
                        src={currentProject.images[0].image}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                        Sin Imagen de Portada
                    </div>
                )}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        {currentProject.name}
                    </h1>
                    <div className="flex items-center gap-4 text-white/90 text-sm">
                        <span className="flex items-center gap-1">
                            <FaMapMarkerAlt /> {currentProject.location}
                        </span>
                        <span className="bg-brand-600 px-2 py-0.5 rounded text-white text-xs font-bold uppercase">
                            {currentProject.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* GRILLA DE INFORMACIÓN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* COLUMNA IZQ: DATOS CLAVE */}
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">
                            Ficha Técnica
                        </h2>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                            <div>
                                <span className="block text-xs font-bold text-slate-400 uppercase">
                                    Categoría
                                </span>
                                <span className="text-slate-700 font-medium flex items-center gap-2 mt-1">
                                    <FaLayerGroup className="text-brand-500" />{' '}
                                    {currentProject.category_name}
                                </span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-400 uppercase">
                                    Edificación
                                </span>
                                <span className="text-slate-700 font-medium flex items-center gap-2 mt-1">
                                    <FaBuilding className="text-brand-500" />{' '}
                                    {currentProject.service_type || '-'}
                                </span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-400 uppercase">
                                    Área Construida
                                </span>
                                <span className="text-slate-700 font-medium flex items-center gap-2 mt-1">
                                    <IoResize className="text-brand-500" />{' '}
                                    {currentProject.area || '-'}
                                </span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-400 uppercase">
                                    Niveles
                                </span>
                                <span className="text-slate-700 font-medium mt-1">
                                    {currentProject.levels || '-'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">
                            Información Adicional
                        </h2>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                            {currentProject.extra_info ||
                                'No hay información extra registrada.'}
                        </p>
                    </div>
                </div>

                {/* COLUMNA DER: GALERÍA */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-4">
                            Galería ({currentProject.images.length})
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {currentProject.images.map((img) => (
                                <div
                                    key={img.id}
                                    className="aspect-square rounded-lg overflow-hidden border border-slate-100 cursor-pointer hover:opacity-90 transition-opacity"
                                >
                                    <img
                                        src={img.image}
                                        alt="Gallery"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {currentProject.videos.length > 0 && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="font-bold text-slate-800 mb-4">
                                Videos ({currentProject.videos.length})
                            </h3>
                            <div className="space-y-3">
                                {currentProject.videos.map((vid) => (
                                    <video
                                        key={vid.id}
                                        src={vid.video}
                                        controls
                                        className="w-full rounded-lg bg-black aspect-video"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;
