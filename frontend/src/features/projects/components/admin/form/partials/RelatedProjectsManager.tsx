import React, { useState, useMemo } from 'react';
import {
    FaSearch,
    FaLink,
    FaImage,
    FaPlus,
    FaTimes,
} from 'react-icons/fa';
import { ProjectCard } from '@/features/projects/types';

interface RelatedProjectsManagerProps {
    availableProjects: ProjectCard[];
    selectedIds: string[];
    onToggle: (id: string) => void;
}

export const RelatedProjectsManager: React.FC<RelatedProjectsManagerProps> = ({
    availableProjects,
    selectedIds,
    onToggle,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const searchResults = useMemo(() => {
        if (!searchTerm.trim()) return [];
        return availableProjects
            .filter((p) => !selectedIds.includes(String(p.id)))
            .filter((p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(0, 5);
    }, [availableProjects, searchTerm, selectedIds]);

    const selectedProjects = useMemo(() => {
        return availableProjects.filter((p) =>
            selectedIds.includes(String(p.id))
        );
    }, [availableProjects, selectedIds]);

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="mb-6 border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <FaLink className="text-orange-500" />
                    Proyectos Relacionados
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                    Conecta este proyecto con otros similares o etapas del mismo
                    desarrollo.
                </p>
            </div>

            <div className="relative mb-6">
                <div
                    className={`relative group transition-all rounded-xl border ${isFocused ? 'ring-4 ring-orange-500/10 border-orange-500' : 'border-slate-200'}`}
                >
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar proyecto para añadir..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl outline-none bg-transparent text-sm font-medium text-slate-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() =>
                            setTimeout(() => setIsFocused(false), 200)
                        }
                    />
                </div>

                {isFocused && searchTerm && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-fade-in-up">
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
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                        {proj.cover ? (
                                            <img
                                                src={proj.cover}
                                                className="w-full h-full object-cover"
                                                alt=""
                                            />
                                        ) : (
                                            <FaImage className="m-auto mt-3 text-slate-300" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-slate-700 group-hover:text-orange-700 transition-colors">
                                            {proj.name}
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            {proj.year} • {proj.location}
                                        </p>
                                    </div>
                                    <div className="bg-orange-100 text-orange-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <FaPlus size={10} />
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="p-4 text-center text-xs text-slate-400">
                                No se encontraron proyectos.
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="space-y-3">
                {selectedProjects.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                        <p className="text-xs text-slate-400 font-medium">
                            No hay proyectos seleccionados.
                        </p>
                    </div>
                ) : (
                    selectedProjects.map((proj) => (
                        <div
                            key={proj.id}
                            className="flex items-center gap-4 p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all group animate-fade-in"
                        >
                            <div className="w-1 h-8 bg-orange-500 rounded-full shrink-0"></div>

                            <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-100 relative">
                                {proj.cover ? (
                                    <img
                                        src={proj.cover}
                                        className="w-full h-full object-cover"
                                        alt={proj.name}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <FaImage />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-800 truncate">
                                    {proj.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                        {proj.year || 'N/A'}
                                    </span>
                                    {proj.category_names[0] && (
                                        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md truncate max-w-[150px]">
                                            {proj.category_names[0]}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => onToggle(String(proj.id))}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                title="Desvincular proyecto"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
