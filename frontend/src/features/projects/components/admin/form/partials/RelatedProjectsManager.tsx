import React, { useState, useMemo } from 'react';
import {
    FaSearch,
    FaImage,
    FaPlus,
    FaTimes,
    FaLink,
    FaExternalLinkAlt,
} from 'react-icons/fa';
import { ProjectCard } from '@/features/projects/types';

interface RelatedProjectsManagerProps {
    availableProjects: ProjectCard[];
    selectedIds: string[];
    onToggle: (id: string) => void;
    onView?: (id: string) => void;
}

export const RelatedProjectsManager: React.FC<RelatedProjectsManagerProps> = ({
    availableProjects,
    selectedIds,
    onToggle,
    onView,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const searchResults = useMemo(() => {
        if (!searchTerm.trim()) return [];
        return availableProjects
            .filter((p) => !selectedIds.includes(String(p.id)))
            .filter((p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [availableProjects, searchTerm, selectedIds]);

    const selectedProjects = useMemo(() => {
        return availableProjects.filter((p) =>
            selectedIds.includes(String(p.id))
        );
    }, [availableProjects, selectedIds]);

    return (
        <div className="space-y-6">
            <div className="relative z-20">
                <div
                    className={`relative group transition-all rounded-xl border ${
                        isFocused
                            ? 'ring-4 ring-orange-500/10 border-orange-500 bg-white'
                            : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                    }`}
                >
                    <FaSearch
                        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isFocused ? 'text-orange-500' : 'text-slate-400'}`}
                    />
                    <input
                        type="text"
                        placeholder="Buscar proyecto para vincular..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl outline-none bg-transparent text-sm font-medium text-slate-700 placeholder-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() =>
                            setTimeout(() => setIsFocused(false), 200)
                        }
                    />
                </div>

                {isFocused && searchTerm && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 z-[100] overflow-hidden animate-fade-in-up">
                        <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                            {searchResults.length > 0 ? (
                                searchResults.map((proj) => (
                                    <button
                                        key={proj.id}
                                        type="button"
                                        onClick={() => {
                                            onToggle(String(proj.id));
                                            setSearchTerm('');
                                        }}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-orange-50 text-left transition-colors border-b border-slate-50 last:border-0 group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200 relative">
                                            {proj.cover ? (
                                                <img
                                                    src={proj.cover}
                                                    className="w-full h-full object-cover"
                                                    alt=""
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <FaImage size={12} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-slate-700 group-hover:text-orange-700 transition-colors truncate">
                                                {proj.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400 truncate">
                                                {proj.year} • {proj.location}
                                            </p>
                                        </div>

                                        <div className="bg-orange-100 text-orange-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 shrink-0">
                                            <FaPlus size={10} />
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="p-4 text-center text-xs text-slate-400 italic">
                                    No se encontraron coincidencias.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-3 relative z-10">
                {selectedProjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/30">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-2">
                            <FaLink />
                        </div>
                        <p className="text-xs text-slate-400 font-medium">
                            No hay proyectos vinculados.
                        </p>
                    </div>
                ) : (
                    selectedProjects.map((proj) => (
                        <div
                            key={proj.id}
                            className="flex items-center gap-4 p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all group animate-fade-in relative overflow-hidden"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-l-xl"></div>

                            <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-100 relative ml-2">
                                {proj.cover ? (
                                    <img
                                        src={proj.cover}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        alt={proj.name}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <FaImage size={18} />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-800 truncate group-hover:text-orange-700 transition-colors">
                                    {proj.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                        {proj.year || 'N/A'}
                                    </span>
                                    {proj.category_names &&
                                        proj.category_names[0] && (
                                            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 truncate max-w-[150px]">
                                                {proj.category_names[0]}
                                            </span>
                                        )}
                                </div>
                            </div>

                            <div className="flex items-center gap-1 mr-1">
                                {onView && (
                                    <button
                                        type="button"
                                        onClick={() => onView(proj.slug)}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                        title="Ver en sitio web"
                                    >
                                        <FaExternalLinkAlt size={14} />
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => onToggle(String(proj.id))}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="Desvincular proyecto"
                                >
                                    <FaTimes size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
