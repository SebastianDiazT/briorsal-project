import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa';
import { Project } from '@/types';

interface Props {
    project: Project;
}

export const GlassProjectCard: React.FC<Props> = ({ project }) => {
    const mainImage = project.images?.[0]?.image;

    return (
        <Link 
            to={`/projects/${project.slug}`}
            className="group relative block h-96 w-full rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
        >
            {/* Imagen de fondo full */}
            {mainImage ? (
                <img 
                    src={mainImage} 
                    alt={project.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            ) : (
                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-500">Sin Imagen</div>
            )}

            {/* Overlay gradiente sutil para legibilidad general */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

            {/* Panel de Vidrio (Glassmorphism) */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl text-white transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/30 group-hover:bottom-6">
                
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <span className="text-orange-300 text-[10px] font-bold uppercase tracking-widest">
                            {project.category_name}
                        </span>
                        <h3 className="text-xl font-bold leading-tight mt-1 mb-1">
                            {project.name}
                        </h3>
                    </div>
                    {/* Icono de flecha en círculo */}
                    <div className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center transform -rotate-45 group-hover:rotate-0 transition-transform duration-300">
                        <FaArrowRight size={12} />
                    </div>
                </div>

                <div className="flex items-center gap-2 text-white/80 text-xs font-medium">
                    <FaMapMarkerAlt className="text-orange-400" />
                    <span>{project.location}</span>
                    <span className="mx-1">•</span>
                    <span>{project.status === 'In Progress' ? 'En Ejecución' : 'Entregado'}</span>
                </div>
            </div>
        </Link>
    );
};