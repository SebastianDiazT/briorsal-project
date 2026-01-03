import React from 'react';
import { FaEdit, FaTrash, FaImage } from 'react-icons/fa';
import { Service } from '../../types';

interface ServicesTableProps {
    services: Service[];
    isLoading: boolean;
    onEdit: (service: Service) => void;
    onDelete: (id: number) => void;
    EmptyState: React.ComponentType;
}

export const ServicesTable: React.FC<ServicesTableProps> = ({
    services,
    isLoading,
    onEdit,
    onDelete,
    EmptyState,
}) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 animate-pulse"
                        >
                            <div className="w-16 h-12 bg-slate-100 rounded-lg shrink-0"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="hidden md:table-header-group">
                    <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="py-4 px-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest w-[100px] text-center">
                            Portada
                        </th>

                        <th className="py-4 px-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest w-[25%]">
                            Información
                        </th>

                        <th className="py-4 px-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest w-auto hidden md:table-cell">
                            Descripción
                        </th>

                        <th className="py-4 px-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest w-[120px] text-right">
                            Acciones
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 md:divide-slate-50">
                    {services.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="p-0">
                                <EmptyState />
                            </td>
                        </tr>
                    ) : (
                        services.map((service) => (
                            <tr
                                key={service.id}
                                className="group flex flex-row items-center p-3 gap-3 md:p-0 md:table-row hover:bg-slate-50/60 transition-colors duration-150"
                            >
                                <td className="block shrink-0 md:table-cell md:py-3 md:px-4 md:align-middle md:text-center">
                                    <div className="relative inline-block h-14 w-20 md:h-12 md:w-16 rounded-lg overflow-hidden border bg-slate-100 shadow-sm border-slate-200">
                                        {service.image ? (
                                            <img
                                                src={service.image}
                                                alt={service.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <FaImage size={16} />
                                            </div>
                                        )}
                                    </div>
                                </td>

                                <td className="block flex-1 min-w-0 md:table-cell md:py-3 md:px-4 md:align-middle">
                                    <div className="flex flex-col gap-1">
                                        <span
                                            className="text-sm md:text-sm font-bold text-slate-800 leading-tight group-hover:text-orange-600 transition-colors truncate block w-full"
                                            title={service.name}
                                        >
                                            {service.name}
                                        </span>
                                        <p className="text-xs text-slate-500 line-clamp-1 md:hidden">
                                            {service.description ||
                                                'Sin descripción'}
                                        </p>
                                    </div>
                                </td>

                                <td className="hidden md:table-cell md:py-3 md:px-4 md:align-middle">
                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                                        {service.description}
                                    </p>
                                </td>

                                <td className="block shrink-0 md:table-cell md:py-3 md:px-6 md:align-middle md:text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(service)}
                                            className="w-9 h-9 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-slate-50 md:bg-white text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all active:scale-95 shadow-sm"
                                            title="Editar"
                                        >
                                            <FaEdit className="text-sm md:text-xs" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(service.id)}
                                            className="w-9 h-9 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-slate-50 md:bg-white text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all active:scale-95 shadow-sm"
                                            title="Eliminar"
                                        >
                                            <FaTrash className="text-sm md:text-xs" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
