import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaExpand } from 'react-icons/fa';
import { Project } from '@/types';

interface Props {
    project: Project;
}

export const ImmersiveProjectCard: React.FC<Props> = ({ project }) => {
    const mainImage = project.images?.[0]?.image;

    return (
        <Link
            to={`/projects/${project.slug}`}
            className="group relative block h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
        >
            {/* Imagen de Fondo */}
            {mainImage ? (
                <img
                    src={mainImage}
                    alt={project.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            ) : (
                <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                    Sin Imagen
                </div>
            )}

            {/* Overlay Gradiente (Siempre visible para legibilidad, más oscuro al hover) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

            {/* Contenido Flotante */}
            <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                {/* Categoría pequeña arriba del título */}
                <span className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-2 block">
                    {project.category_name}
                </span>

                <h3 className="text-2xl font-bold text-white mb-1 leading-tight">
                    {project.name}
                </h3>

                <div className="flex items-center text-slate-300 text-sm mb-4">
                    <FaMapMarkerAlt className="mr-1" size={12} />
                    <span>{project.location}</span>
                </div>

                {/* Línea decorativa que crece al hover */}
                <div className="w-12 h-1 bg-brand-500 rounded-full group-hover:w-full transition-all duration-500"></div>

                {/* Botón fantasma que aparece */}
                <div className="mt-4 flex items-center gap-2 text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    Ver Detalles <FaExpand />
                </div>
            </div>
        </Link>
    );
};
