import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaArrowRight, FaImage } from 'react-icons/fa';
import { Project } from '@/types';

interface Props {
    project: Project;
}

export const PublicProjectCard: React.FC<Props> = ({ project }) => {
    // Usamos la primera imagen disponible o un placeholder si no hay
    const mainImage =
        project.images && project.images.length > 0
            ? project.images[0].image
            : null;

    return (
        <Link
            to={`/projects/${project.slug}`}
            className="group relative block h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100"
        >
            {/* --- Imagen --- */}
            <div className="relative h-64 overflow-hidden bg-slate-100">
                {mainImage ? (
                    <img
                        src={mainImage}
                        alt={project.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <FaImage size={40} />
                    </div>
                )}

                {/* Badge de Categoría (Flotante) */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-600 shadow-sm uppercase tracking-wider">
                    {project.category_name}
                </div>

                {/* Overlay oscuro al hover (Efecto "Ver Detalles") */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <span className="text-white font-bold flex items-center gap-2">
                        Ver Detalles <FaArrowRight />
                    </span>
                </div>
            </div>

            {/* --- Contenido --- */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-brand-600 transition-colors">
                    {project.name}
                </h3>

                <div className="flex items-center text-slate-500 text-sm mb-4">
                    <FaMapMarkerAlt className="mr-2 text-brand-500" />
                    <span className="truncate">{project.location}</span>
                </div>

                {/* Pie de tarjeta: Solo Estado (ID Eliminado) */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span
                        className={`text-xs font-bold px-2 py-1 rounded border ${
                            project.status === 'In Progress'
                                ? 'bg-blue-50 text-blue-600 border-blue-100'
                                : 'bg-green-50 text-green-600 border-green-100'
                        }`}
                    >
                        {project.status === 'In Progress'
                            ? 'En Ejecución'
                            : 'Entregado'}
                    </span>
                </div>
            </div>
        </Link>
    );
};
