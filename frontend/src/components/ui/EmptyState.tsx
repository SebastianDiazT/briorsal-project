import React from 'react';
import { FaFolderOpen, FaSearch, FaPlus, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
    title: string;
    description: string;
    isFiltered?: boolean;
    onClear?: () => void;
    createLink?: string;
    createText?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    isFiltered = false,
    onClear,
    createLink,
    createText = 'Crear Nuevo',
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in-up border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <div className="relative mb-6 group">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center relative z-10 shadow-sm border border-slate-100 group-hover:scale-105 transition-transform duration-500">
                    {isFiltered ? (
                        <FaSearch className="text-4xl text-slate-300 group-hover:text-orange-400 transition-colors" />
                    ) : (
                        <FaFolderOpen className="text-4xl text-slate-300 group-hover:text-orange-400 transition-colors" />
                    )}
                </div>

                <div className="absolute top-0 left-0 w-24 h-24 bg-orange-100/50 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="absolute bottom-0 right-0 z-20 bg-white p-1.5 rounded-full shadow-md border border-slate-100">
                    {isFiltered ? (
                        <FaTimes className="text-red-400" size={12} />
                    ) : (
                        <FaPlus className="text-orange-500" size={12} />
                    )}
                </div>
            </div>

            <div className="text-center max-w-sm mx-auto space-y-2 mb-8">
                <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    {description}
                </p>
            </div>

            <div>
                {isFiltered && onClear ? (
                    <button
                        onClick={onClear}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 hover:text-red-500 hover:border-red-200 transition-all shadow-sm active:scale-95"
                    >
                        <FaTimes size={12} /> Limpiar Filtros
                    </button>
                ) : createLink ? (
                    <Link
                        to={createLink}
                        className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-600/20 hover:bg-orange-700 hover:-translate-y-0.5 transition-all active:scale-95"
                    >
                        <FaPlus size={12} /> {createText}
                    </Link>
                ) : null}
            </div>
        </div>
    );
};
