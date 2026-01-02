import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaMapMarkerAlt,
    FaRulerCombined,
    FaArrowRight,
    FaImage,
} from 'react-icons/fa';
import { Project } from '@/features/projects/types';

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    const hasImage = project.images.length > 0;

    return (
        <Link
            to={`/proyectos/${project.slug}`}
            className="group relative block h-[400px] w-full overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-500"
        >
            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                {hasImage ? (
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${project.images[0].image})`,
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                        <FaImage size={64} />{' '}
                    </div>
                )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

            <div className="absolute top-4 left-4 flex gap-2 z-10">
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-orange-600 rounded-full shadow-lg">
                    {project.category_name}
                </span>
                {project.status === 'en_proceso' && (
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-100 rounded-full shadow-lg">
                        En Ejecución
                    </span>
                )}
            </div>

            <div className="absolute bottom-0 left-0 w-full p-6 text-white z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl font-bold mb-2 leading-tight group-hover:text-orange-400 transition-colors drop-shadow-md">
                    {project.name}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-200 mb-4 font-medium">
                    <div className="flex items-center gap-1.5">
                        <FaMapMarkerAlt className="text-orange-500" />
                        <span className="truncate max-w-[150px]">
                            {project.location}
                        </span>
                    </div>
                    {project.area && (
                        <div className="flex items-center gap-1.5">
                            <FaRulerCombined className="text-orange-500" />
                            <span>{project.area} m²</span>
                        </div>
                    )}
                </div>

                <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 overflow-hidden transition-all duration-500 delay-100">
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-white border-b border-orange-500 pb-0.5">
                        Ver Detalles <FaArrowRight size={12} />
                    </span>
                </div>
            </div>
        </Link>
    );
};
