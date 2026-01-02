import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { Project } from '@/types';

interface Props {
    project: Project;
}

export const MasonryProjectCard: React.FC<Props> = ({ project }) => {
    const mainImage = project.images?.[0]?.image;

    return (
        <Link
            to={`/projects/${project.slug}`}
            className="group block mb-8 break-inside-avoid" // break-inside-avoid es clave para masonry
        >
            <div className="relative overflow-hidden rounded-xl bg-slate-100">
                {/* La imagen tiene un overlay sutil que desaparece al hover */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>

                {mainImage ? (
                    <img
                        src={mainImage}
                        alt={project.name}
                        className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                ) : (
                    <div className="w-full h-64 flex items-center justify-center text-slate-300">
                        Sin Imagen
                    </div>
                )}

                {/* Badge flotante */}
                <div className="absolute top-3 right-3 z-20">
                    <span className="bg-white/90 backdrop-blur text-brand-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest shadow-sm">
                        {project.category_name}
                    </span>
                </div>
            </div>

            {/* Info Minimalista Debajo */}
            <div className="mt-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-brand-600 transition-colors">
                        {project.name}
                    </h3>
                    <FaArrowRight className="text-slate-300 group-hover:text-brand-500 -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
                <p className="text-sm text-slate-500 mt-1">
                    {project.location}
                </p>
            </div>
        </Link>
    );
};
