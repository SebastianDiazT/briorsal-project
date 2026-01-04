import React from 'react';
import { FaEdit, FaTrash, FaTag } from 'react-icons/fa';
import { Category } from '../../types';

interface CategoriesTableProps {
    categories: Category[];
    isLoading: boolean;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    EmptyState: React.ComponentType;
}

export const CategoriesTable: React.FC<CategoriesTableProps> = ({
    categories,
    isLoading,
    onEdit,
    onDelete,
    EmptyState,
}) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 animate-pulse"
                        >
                            <div className="w-10 h-10 bg-slate-100 rounded-lg shrink-0"></div>
                            <div className="flex-1 h-4 bg-slate-100 rounded w-1/3"></div>
                            <div className="w-20 h-8 bg-slate-100 rounded-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="py-4 px-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest w-auto">
                                Nombre de Categoría
                            </th>
                            <th className="py-4 px-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest w-[120px] text-right">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan={2} className="p-0">
                                    <EmptyState />
                                </td>
                            </tr>
                        ) : (
                            categories.map((category) => (
                                <tr
                                    key={category.id}
                                    className="group hover:bg-slate-50/60 transition-colors duration-150"
                                >
                                    <td className="py-4 px-6 align-middle">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                                <FaTag size={12} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700 group-hover:text-orange-600 transition-colors">
                                                {category.name}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="py-4 px-6 align-middle text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() =>
                                                    onEdit(category.id)
                                                }
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all active:scale-95 shadow-sm"
                                                title="Editar"
                                            >
                                                <FaEdit size={12} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    onDelete(category.id)
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
