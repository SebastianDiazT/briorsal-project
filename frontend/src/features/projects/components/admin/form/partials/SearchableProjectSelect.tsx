import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    FaSearch,
    FaCheck,
    FaTimes,
    FaChevronDown,
    FaImage,
    FaPlus,
    FaLayerGroup,
} from 'react-icons/fa';
import { ProjectCard } from '@/features/projects/types';

interface SearchableProjectSelectProps {
    availableProjects: ProjectCard[];
    selectedIds: string[];
    onToggle: (id: string) => void;
}

export const SearchableProjectSelect: React.FC<
    SearchableProjectSelectProps
> = ({ availableProjects, selectedIds, onToggle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredProjects = useMemo(() => {
        return availableProjects
            .filter((p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(0, 10);
    }, [availableProjects, searchTerm]);

    const selectedProjects = useMemo(() => {
        return availableProjects.filter((p) =>
            selectedIds.includes(String(p.id))
        );
    }, [availableProjects, selectedIds]);

    return (
        <div className="relative" ref={containerRef}>
            <div
                className={`relative group transition-all rounded-xl border bg-white ${isOpen ? 'ring-4 ring-orange-500/10 border-orange-500' : 'border-slate-200'}`}
                onClick={() => setIsOpen(true)}
            >
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    className="w-full pl-10 pr-10 py-3 rounded-xl outline-none bg-transparent text-sm font-medium text-slate-700 placeholder-slate-400"
                    placeholder="Buscar por nombre (ej: Casa Playa...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <FaChevronDown
                        size={12}
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-100 shadow-xl max-h-72 overflow-y-auto z-50 animate-fade-in-up">
                    {filteredProjects.length > 0 ? (
                        filteredProjects.map((proj) => {
                            const isSelected = selectedIds.includes(
                                String(proj.id)
                            );
                            return (
                                <button
                                    key={proj.id}
                                    type="button"
                                    onClick={() => onToggle(String(proj.id))}
                                    className={`w-full flex items-start gap-3 p-3 text-left transition-colors border-b border-slate-50 last:border-0 group ${isSelected ? 'bg-orange-50' : 'hover:bg-slate-50'}`}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200 mt-0.5">
                                        {proj.cover ? (
                                            <img
                                                src={proj.cover}
                                                className="w-full h-full object-cover"
                                                alt=""
                                            />
                                        ) : (
                                            <FaImage className="m-auto mt-3 text-slate-300 text-xs" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <p
                                                className={`text-xs font-bold truncate pr-2 ${isSelected ? 'text-orange-800' : 'text-slate-700'}`}
                                            >
                                                {proj.name}
                                            </p>
                                            {isSelected ? (
                                                <FaCheck
                                                    className="text-orange-500 shrink-0"
                                                    size={12}
                                                />
                                            ) : (
                                                <div className="bg-slate-100 text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-500 p-1 rounded-full transition-colors">
                                                    <FaPlus size={8} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                            <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                                                {proj.year || 'S/F'}
                                            </span>
                                            {proj.category_names.length > 0 ? (
                                                proj.category_names.map(
                                                    (cat, i) => (
                                                        <span
                                                            key={i}
                                                            className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded flex items-center gap-1"
                                                        >
                                                            <FaLayerGroup
                                                                size={8}
                                                            />{' '}
                                                            {cat}
                                                        </span>
                                                    )
                                                )
                                            ) : (
                                                <span className="text-[10px] text-slate-400 italic">
                                                    Sin categoría
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    ) : (
                        <div className="p-6 text-center">
                            <p className="text-xs font-bold text-slate-600">
                                No se encontraron proyectos.
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1">
                                Intenta con otro nombre.
                            </p>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-4 space-y-3">
                {selectedProjects.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <p className="text-sm font-bold text-slate-500">
                            Ningún proyecto relacionado
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            Usa el buscador para conectar obras.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-2">
                        {selectedProjects.map((proj) => (
                            <div
                                key={proj.id}
                                className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all group animate-fade-in"
                            >
                                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-100 relative">
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
                                        <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-1.5 rounded">
                                            {proj.year}
                                        </span>
                                        {proj.category_names.map((cat, i) => (
                                            <span
                                                key={i}
                                                className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 rounded border border-blue-100 truncate max-w-[150px]"
                                            >
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => onToggle(String(proj.id))}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="Desvincular"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
