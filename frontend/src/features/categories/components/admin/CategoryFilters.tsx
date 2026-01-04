import React from 'react';
import { FaSearch, FaTimes, FaSortAmountDown } from 'react-icons/fa';
import { CustomSelect } from '@components/ui/CustomSelect';

interface CategoryFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    pageSize: number;
    onPageSizeChange: (value: number) => void;
    onClear: () => void;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
    searchTerm,
    onSearchChange,
    pageSize,
    onPageSizeChange,
    onClear,
}) => {
    const sizeOptions = [
        { value: 5, label: '5 por página' },
        { value: 10, label: '10 por página' },
        { value: 20, label: '20 por página' },
        { value: 50, label: '50 por página' },
        { value: -1, label: 'Mostrar todo' },
    ];

    const baseInputStyles =
        'w-full h-[42px] bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all hover:border-slate-300';

    return (
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-3 relative z-20">
            <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <FaSearch
                        className={`transition-colors ${searchTerm ? 'text-orange-500' : 'text-slate-400 group-focus-within:text-orange-500'}`}
                    />
                </div>
                <input
                    type="text"
                    placeholder="Buscar categoría..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={`${baseInputStyles} pl-10 pr-12`}
                />

                {searchTerm && (
                    <button
                        onClick={onClear}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-red-500 transition-colors"
                        title="Limpiar búsqueda"
                    >
                        <FaTimes />
                    </button>
                )}
            </div>

            <div className="w-full md:w-48 border-t md:border-t-0 md:border-l border-slate-100 p-2 md:p-0 flex items-center justify-end md:pl-3">
                <CustomSelect
                    value={pageSize}
                    onChange={(val) => onPageSizeChange(Number(val))}
                    options={sizeOptions}
                    placeholder="Filas"
                    icon={FaSortAmountDown}
                />
            </div>
        </div>
    );
};
