import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaArrowRight, FaRulerCombined } from 'react-icons/fa';
import { Project } from '@/types';

interface Props {
    project: Project;
}

export const EditorialProjectCard: React.FC<Props> = ({ project }) => {
    const mainImage = project.images?.[0]?.image;

    return (
        <Link
            to={`/projects/${project.slug}`}
            className="group relative flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
        >
            {/* Imagen (Ocupa el 45% del ancho en escritorio) */}
            <div className="w-full md:w-[45%] relative overflow-hidden h-64 md:h-auto">
                {mainImage ? (
                    <img
                        src={mainImage}
                        alt={project.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                        Sin Imagen
                    </div>
                )}

                {/* Badge de Estado flotante sobre la imagen */}
                <div className="absolute top-4 left-4">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                            project.status === 'In Progress'
                                ? 'bg-blue-600 text-white'
                                : 'bg-green-600 text-white'
                        }`}
                    >
                        {project.status === 'In Progress'
                            ? 'En Ejecución'
                            : 'Entregado'}
                    </span>
                </div>
            </div>

            {/* Contenido (Ocupa el resto) */}
            <div className="flex-1 p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-orange-500 font-bold text-xs uppercase tracking-widest">
                        {project.category_name}
                    </span>
                    <span className="w-8 h-px bg-slate-200"></span>
                </div>

                <h3 className="text-2xl font-extrabold text-slate-800 mb-3 group-hover:text-orange-600 transition-colors leading-tight">
                    {project.name}
                </h3>

                {/* Si tienes una descripción corta o extra_info, se vería genial aquí */}
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                    {project.extra_info ||
                        `Un proyecto exclusivo de ${project.category_name} ubicado en una zona estratégica, diseñado con los más altos estándares.`}
                </p>

                <div className="flex items-center gap-6 text-sm text-slate-400 font-medium mb-6">
                    <span className="flex items-center gap-2">
                        <FaMapMarkerAlt /> {project.location}
                    </span>
                    {project.area && (
                        <span className="flex items-center gap-2">
                            <FaRulerCombined /> {project.area} m²
                        </span>
                    )}
                </div>

                <div className="mt-auto">
                    <span className="inline-flex items-center gap-2 text-slate-800 font-bold group-hover:gap-4 transition-all duration-300">
                        Ver Detalles{' '}
                        <FaArrowRight className="text-orange-500" />
                    </span>
                </div>
            </div>
        </Link>
    );
};
