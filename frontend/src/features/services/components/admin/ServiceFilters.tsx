import React from 'react';
import { FaSearch, FaTimes, FaSortAmountDown } from 'react-icons/fa';
import { CustomSelect } from '@components/ui/CustomSelect';

interface ServiceFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    pageSize: number;
    onPageSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    hasActiveFilters: boolean;
    onClear: () => void;
}

export const ServiceFilters: React.FC<ServiceFiltersProps> = ({
    searchTerm,
    onSearchChange,
    pageSize,
    onPageSizeChange,
    hasActiveFilters,
    onClear,
}) => {
    const sizeOptions = [
        { value: 5, label: '5 por página' },
        { value: 10, label: '10 por página' },
        { value: 20, label: '20 por página' },
        { value: 50, label: '50 por página' },
        { value: -1, label: 'Mostrar Todos' },
    ];

    const baseInputStyles =
        'w-full h-[42px] bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all hover:border-slate-300';

    return (
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col xl:flex-row gap-3 relative z-20 animate-fade-in-up delay-75">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 p-2">
                <div className="md:col-span-11 relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <FaSearch
                            className={`transition-colors ${searchTerm ? 'text-orange-500' : 'text-slate-400 group-focus-within:text-orange-500'}`}
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, descripción..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className={`${baseInputStyles} pl-10 pr-4`}
                    />
                </div>

                <div className="md:col-span-1 flex items-center justify-center">
                    {hasActiveFilters && (
                        <button
                            onClick={onClear}
                            className="w-full h-[42px] flex items-center justify-center gap-2 bg-red-50 text-red-500 border border-red-100 rounded-xl hover:bg-red-100 hover:border-red-200 transition-all group shadow-sm"
                            title="Limpiar filtros"
                        >
                            <FaTimes className="group-hover:rotate-90 transition-transform" />
                        </button>
                    )}
                </div>
            </div>

            <div className="border-t xl:border-t-0 xl:border-l border-slate-100 p-2 flex items-center justify-end xl:justify-center min-w-[180px]">
                <CustomSelect
                    value={pageSize}
                    onChange={(val) =>
                        onPageSizeChange({ target: { value: val } } as any)
                    }
                    options={sizeOptions}
                    placeholder="Filas por pág."
                    icon={FaSortAmountDown}
                />
            </div>
        </div>
    );
};
