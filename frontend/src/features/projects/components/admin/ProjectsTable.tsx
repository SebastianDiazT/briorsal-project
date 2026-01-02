import React from 'react';
import {
    FaEdit,
    FaTrash,
    FaImage,
    FaStar,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaLayerGroup,
} from 'react-icons/fa';
import { Project } from '@/features/projects/types';

interface ProjectsTableProps {
    projects: Project[];
    isLoading: boolean;
    onEdit: (slug: string) => void;
    onDelete: (slug: string) => void;
    EmptyState: React.FC;
}

export const ProjectsTable: React.FC<ProjectsTableProps> = ({
    projects,
    isLoading,
    onEdit,
    onDelete,
    EmptyState,
}) => {
    // Skeletons ajustados al nuevo layout
    if (isLoading) {
        return (
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className="flex items-center gap-6 animate-pulse"
                        >
                            <div className="w-16 h-12 bg-slate-100 rounded-lg shrink-0"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                                <div className="h-3 bg-slate-100 rounded w-1/4"></div>
                            </div>
                            <div className="w-24 h-8 bg-slate-100 rounded-full"></div>
                            <div className="w-24 h-8 bg-slate-100 rounded-full"></div>
                            <div className="w-20 h-8 bg-slate-100 rounded-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Contenedor con overflow controlado */}
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            {/* COL 1: PORTADA (Ancho fijo pequeño) */}
                            <th className="py-4 px-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest w-[100px] text-center">
                                Portada
                            </th>

                            {/* COL 2: INFO (Ancho fluido, ocupa el espacio sobrante) */}
                            <th className="py-4 px-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest w-auto">
                                Información
                            </th>

                            {/* COL 3: CATEGORÍA (Ancho controlado) */}
                            <th className="py-4 px-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest w-[15%] xl:w-[12%] hidden lg:table-cell">
                                Categoría
                            </th>

                            {/* COL 4: ESTADO (Ancho controlado) */}
                            <th className="py-4 px-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest w-[15%] text-center">
                                Estado
                            </th>

                            {/* COL 5: ACCIONES (Ancho fijo para botones) */}
                            <th className="py-4 px-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest w-[120px] text-right">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {projects.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-0">
                                    <EmptyState />
                                </td>
                            </tr>
                        ) : (
                            projects.map((project) => (
                                <tr
                                    key={project.id}
                                    className="group hover:bg-slate-50/60 transition-colors duration-150"
                                >
                                    {/* 1. PORTADA */}
                                    <td className="py-3 px-4 align-middle text-center">
                                        <div
                                            className={`relative inline-block h-12 w-16 rounded-lg overflow-hidden border bg-slate-100 shadow-sm ${project.is_featured ? 'border-orange-400 ring-1 ring-orange-100' : 'border-slate-200'}`}
                                        >
                                            {project.images &&
                                            project.images.length > 0 ? (
                                                <img
                                                    src={
                                                        project.images[0].image
                                                    }
                                                    alt={project.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <FaImage size={16} />
                                                </div>
                                            )}
                                            {project.is_featured && (
                                                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/10 to-transparent flex items-start justify-end p-0.5">
                                                    <FaStar
                                                        className="text-orange-500 drop-shadow-sm"
                                                        size={10}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* 2. INFORMACIÓN (Truncamiento activado) */}
                                    <td className="py-3 px-4 align-middle">
                                        <div className="flex flex-col gap-1 pr-4">
                                            {/* Nombre truncado */}
                                            <span
                                                className="text-sm font-bold text-slate-800 leading-tight group-hover:text-orange-600 transition-colors truncate block w-full"
                                                title={project.name}
                                            >
                                                {project.name}
                                            </span>

                                            {/* Metadata */}
                                            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium truncate">
                                                <div
                                                    className="flex items-center gap-1 min-w-0"
                                                    title={project.location}
                                                >
                                                    <FaMapMarkerAlt
                                                        className="text-slate-400 shrink-0"
                                                        size={10}
                                                    />
                                                    <span className="truncate">
                                                        {project.location}
                                                    </span>
                                                </div>
                                                {project.year && (
                                                    <div className="hidden xl:flex items-center gap-1 shrink-0">
                                                        <span className="text-slate-300 mr-2">
                                                            •
                                                        </span>
                                                        <FaCalendarAlt
                                                            className="text-slate-400 shrink-0"
                                                            size={10}
                                                        />
                                                        <span>
                                                            {project.year}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Categoría (Solo visible en MD, oculta en LG donde tiene su propia columna) */}
                                                <span className="lg:hidden px-2 py-0.5 bg-slate-100 rounded text-[10px] border border-slate-200 truncate">
                                                    {project.category_name}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* 3. CATEGORÍA (Visible solo en pantallas grandes) */}
                                    <td className="py-3 px-4 align-middle hidden lg:table-cell">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white text-slate-600 text-xs font-semibold border border-slate-200 shadow-sm max-w-full truncate">
                                            <FaLayerGroup
                                                size={10}
                                                className="text-slate-400 shrink-0"
                                            />
                                            <span className="truncate">
                                                {project.category_name || '—'}
                                            </span>
                                        </span>
                                    </td>

                                    {/* 4. ESTADO */}
                                    <td className="py-3 px-4 align-middle text-center">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap ${
                                                project.status === 'en_proceso'
                                                    ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                    : 'bg-green-50 text-green-700 border-green-100'
                                            }`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full ${
                                                    project.status ===
                                                    'en_proceso'
                                                        ? 'bg-blue-500'
                                                        : 'bg-green-500'
                                                }`}
                                            ></span>
                                            {project.status === 'en_proceso'
                                                ? 'En Ejecución'
                                                : 'Entregado'}
                                        </span>
                                    </td>

                                    {/* 5. ACCIONES */}
                                    <td className="py-3 px-6 align-middle text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() =>
                                                    onEdit(project.slug)
                                                }
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all active:scale-95 shadow-sm"
                                                title="Editar"
                                            >
                                                <FaEdit size={12} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    onDelete(project.slug)
                                                }
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all active:scale-95 shadow-sm"
                                                title="Eliminar"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
