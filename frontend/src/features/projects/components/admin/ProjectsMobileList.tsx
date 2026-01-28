import React from 'react';
import {
    FaEdit,
    FaTrash,
    FaImage,
    FaStar,
    FaMapMarkerAlt,
    FaSpinner,
    FaCalendarAlt,
} from 'react-icons/fa';
import { ProjectCard } from '@/features/projects/types';

interface ProjectsMobileListProps {
    projects: ProjectCard[];
    isLoading: boolean;
    onEdit: (slug: string) => void;
    onDelete: (slug: string) => void;
    EmptyState: React.FC;
}

export const ProjectsMobileList: React.FC<ProjectsMobileListProps> = ({
    projects,
    isLoading,
    onEdit,
    onDelete,
    EmptyState,
}) => {
    return (
        <div className="md:hidden flex flex-col gap-4 pb-20">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-12 gap-3 text-slate-400">
                    <FaSpinner className="animate-spin text-3xl text-orange-500" />
                    <span className="text-sm font-medium">
                        Cargando proyectos...
                    </span>
                </div>
            ) : projects.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-8 flex justify-center">
                        <EmptyState />
                    </div>
                </div>
            ) : (
                projects.map((project) => {
                    const displayImage = project.cover;

                    return (
                        <div
                            key={project.id}
                            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative group"
                        >
                            <div className="relative h-48 bg-slate-100 w-full">
                                {displayImage ? (
                                    <img
                                        src={displayImage}
                                        alt={project.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                                        <FaImage size={32} />
                                        <span className="text-xs font-bold uppercase tracking-wider">
                                            Sin Imagen
                                        </span>
                                    </div>
                                )}

                                <div className="absolute top-3 left-3">
                                    <span
                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm border ${
                                            project.status === 'en_proceso'
                                                ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                : 'bg-green-50 text-green-700 border-green-100'
                                        }`}
                                    >
                                        {project.status === 'en_proceso'
                                            ? 'En Ejecución'
                                            : 'Entregado'}
                                    </span>
                                </div>

                                {project.is_featured && (
                                    <div className="absolute top-3 right-3 bg-white text-orange-500 p-1.5 rounded-full shadow-md border border-orange-100">
                                        <FaStar size={12} />
                                    </div>
                                )}
                            </div>

                            <div className="p-4 flex flex-col gap-3">
                                <div>
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {project.category_names &&
                                        project.category_names.length > 0 ? (
                                            project.category_names.map(
                                                (catName, index) => (
                                                    <span
                                                        key={index}
                                                        className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200"
                                                    >
                                                        {catName}
                                                    </span>
                                                )
                                            )
                                        ) : (
                                            <span className="text-[10px] text-slate-400 italic">
                                                Sin categoría
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="font-bold text-slate-800 text-lg leading-snug line-clamp-2 mb-2">
                                        {project.name}
                                    </h3>
                                    <div className="flex flex-col gap-1 text-xs text-slate-500 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <FaMapMarkerAlt className="text-slate-400 w-3" />
                                            <span className="truncate">
                                                {project.location}
                                            </span>
                                        </div>
                                        {project.year && (
                                            <div className="flex items-center gap-1.5">
                                                <FaCalendarAlt className="text-slate-400 w-3" />
                                                <span>{project.year}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 border-t border-slate-100 divide-x divide-slate-100">
                                <button
                                    onClick={() => onEdit(project.slug)}
                                    className="flex items-center justify-center gap-2 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                                >
                                    <FaEdit className="text-slate-400" /> Editar
                                </button>
                                <button
                                    onClick={() => onDelete(project.slug)}
                                    className="flex items-center justify-center gap-2 py-3.5 text-sm font-bold text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
                                >
                                    <FaTrash className="opacity-70" /> Eliminar
                                </button>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};
