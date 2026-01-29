import React from 'react';
import {
    FaEdit,
    FaTrash,
    FaImage,
    FaStar,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaGripVertical,
    FaEye,
} from 'react-icons/fa';
import { ProjectCard } from '@/features/projects/types';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableRowProps {
    project: ProjectCard;
    onEdit: (slug: string) => void;
    onDelete: (slug: string) => void;
    isReordering: boolean;
}

const SortableRow = ({
    project,
    onEdit,
    onDelete,
    isReordering,
}: SortableRowProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: project.id, disabled: !isReordering });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 'auto',
        position: 'relative',
        opacity: isDragging ? 0.5 : 1,
    } as React.CSSProperties;

    const displayImage = project.cover;

    const handleView = () => {
        window.open(`/proyectos/${project.slug}`, '_blank');
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className={`group transition-colors duration-200 ${
                isDragging
                    ? 'bg-orange-50 shadow-inner'
                    : 'hover:bg-slate-50/60 bg-white'
            }`}
        >
            {isReordering && (
                <td className="py-3 px-2 align-middle text-center w-[40px] border-r border-slate-100 bg-slate-50">
                    <button
                        {...attributes}
                        {...listeners}
                        type="button"
                        className="text-slate-400 hover:text-orange-500 cursor-grab active:cursor-grabbing p-2 outline-none touch-none"
                    >
                        <FaGripVertical />
                    </button>
                </td>
            )}

            <td className="py-3 px-4 align-middle text-center w-[100px]">
                <div
                    className={`relative inline-block h-12 w-16 rounded-lg overflow-hidden border bg-slate-100 shadow-sm ${
                        project.is_featured
                            ? 'border-orange-400 ring-1 ring-orange-100'
                            : 'border-slate-200'
                    }`}
                >
                    {displayImage ? (
                        <img
                            src={displayImage}
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

            <td className="py-3 px-4 align-middle">
                <div className="flex flex-col gap-1 pr-4">
                    <span
                        className="text-sm font-bold text-slate-800 leading-tight group-hover:text-orange-600 transition-colors truncate block w-full cursor-pointer hover:underline decoration-orange-300 decoration-2 underline-offset-2"
                        title={project.name}
                        onClick={handleView}
                    >
                        {project.name}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium truncate">
                        <div
                            className="flex items-center gap-1 min-w-0"
                            title={project.location}
                        >
                            <FaMapMarkerAlt
                                className="text-slate-400 shrink-0"
                                size={10}
                            />
                            <span className="truncate">{project.location}</span>
                        </div>
                        {project.year && (
                            <div className="hidden xl:flex items-center gap-1 shrink-0">
                                <span className="text-slate-300 mr-2">•</span>
                                <FaCalendarAlt
                                    className="text-slate-400 shrink-0"
                                    size={10}
                                />
                                <span>{project.year}</span>
                            </div>
                        )}
                    </div>
                </div>
            </td>

            <td className="py-3 px-4 align-middle hidden lg:table-cell w-[20%]">
                <div className="flex flex-wrap gap-1">
                    {project.category_names &&
                    project.category_names.length > 0 ? (
                        <>
                            {project.category_names
                                .slice(0, 2)
                                .map((catName, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200 uppercase tracking-tight"
                                    >
                                        {catName}
                                    </span>
                                ))}
                            {project.category_names.length > 2 && (
                                <span className="text-[10px] font-bold text-slate-400 ml-1">
                                    +{project.category_names.length - 2}
                                </span>
                            )}
                        </>
                    ) : (
                        <span className="text-slate-400 text-xs italic">—</span>
                    )}
                </div>
            </td>

            <td className="py-3 px-4 align-middle text-center w-[120px]">
                <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap ${
                        project.status === 'en_proceso'
                            ? 'bg-blue-50 text-blue-700 border-blue-100'
                            : 'bg-green-50 text-green-700 border-green-100'
                    }`}
                >
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${
                            project.status === 'en_proceso'
                                ? 'bg-blue-500'
                                : 'bg-green-500'
                        }`}
                    ></span>
                    {project.status === 'en_proceso'
                        ? 'En Ejecución'
                        : 'Entregado'}
                </span>
            </td>

            <td className="py-3 px-6 align-middle text-right w-[140px]">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={handleView}
                        disabled={isReordering}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all active:scale-95 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Ver en sitio web"
                    >
                        <FaEye size={11} />
                    </button>

                    <button
                        onClick={() => onEdit(project.slug)}
                        disabled={isReordering}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-slate-500 hover:text-orange-600 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 transition-all active:scale-95 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Editar"
                    >
                        <FaEdit size={12} />
                    </button>

                    <button
                        onClick={() => onDelete(project.slug)}
                        disabled={isReordering}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all active:scale-95 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Eliminar"
                    >
                        <FaTrash size={12} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

interface ProjectsTableProps {
    projects: ProjectCard[];
    isLoading: boolean;
    onEdit: (slug: string) => void;
    onDelete: (slug: string) => void;
    onReorderChange?: (newOrder: ProjectCard[]) => void;
    isReordering: boolean;
    EmptyState: React.FC;
}

export const ProjectsTable: React.FC<ProjectsTableProps> = ({
    projects,
    isLoading,
    onEdit,
    onDelete,
    onReorderChange,
    isReordering,
    EmptyState,
}) => {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id && onReorderChange) {
            const oldIndex = projects.findIndex((p) => p.id === active.id);
            const newIndex = projects.findIndex((p) => p.id === over.id);
            const newOrder = arrayMove(projects, oldIndex, newIndex);
            onReorderChange(newOrder);
        }
    };

    if (isLoading) {
        return (
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="flex items-center gap-6 animate-pulse"
                        >
                            <div className="w-16 h-12 bg-slate-100 rounded-lg shrink-0"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                                <div className="h-3 bg-slate-50 rounded w-1/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div
            className={`hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all ${
                isReordering ? 'ring-2 ring-orange-400 ring-offset-2' : ''
            }`}
        >
            <div className="w-full overflow-x-auto">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                {isReordering && (
                                    <th className="w-[40px] px-2 text-center text-orange-600 bg-orange-50 border-r border-orange-100">
                                        #
                                    </th>
                                )}
                                <th className="py-4 px-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest text-center">
                                    Portada
                                </th>
                                <th className="py-4 px-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest w-auto">
                                    Información
                                </th>
                                <th className="py-4 px-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest hidden lg:table-cell">
                                    Categorías
                                </th>
                                <th className="py-4 px-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest text-center">
                                    Estado
                                </th>
                                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest text-right">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {projects.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={isReordering ? 6 : 5}
                                        className="p-0"
                                    >
                                        <EmptyState />
                                    </td>
                                </tr>
                            ) : (
                                <SortableContext
                                    items={projects.map((p) => p.id)}
                                    strategy={verticalListSortingStrategy}
                                    disabled={!isReordering}
                                >
                                    {projects.map((project) => (
                                        <SortableRow
                                            key={project.id}
                                            project={project}
                                            onEdit={onEdit}
                                            onDelete={onDelete}
                                            isReordering={isReordering}
                                        />
                                    ))}
                                </SortableContext>
                            )}
                        </tbody>
                    </table>
                </DndContext>
            </div>
        </div>
    );
};
