import React from 'react';
import { FaSearch, FaTimes, FaSortAmountDown } from 'react-icons/fa';
import { CustomSelect } from '@/components/ui/CustomSelect';

interface ClientFiltersProps {
    searchTerm: string;
    onSearchChange: (val: string) => void;
    pageSize: number;
    onPageSizeChange: (val: number) => void;
    onClear: () => void;
}

export const ClientFilters: React.FC<ClientFiltersProps> = ({
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

    return (
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-3 relative z-20">
            <div className="flex-1 relative group p-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaSearch
                        className={`transition-colors ${searchTerm ? 'text-orange-500' : 'text-slate-400'}`}
                    />
                </div>
                <input
                    type="text"
                    placeholder="Buscar cliente..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full h-[42px] bg-white border border-slate-200 rounded-xl pl-10 pr-10 text-sm font-semibold text-slate-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all placeholder-slate-400"
                />

                {searchTerm && (
                    <button
                        onClick={onClear}
                        className="absolute inset-y-0 right-0 pr-2 flex items-center"
                    >
                        <div className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors">
                            <FaTimes size={12} />
                        </div>
                    </button>
                )}
            </div>

            <div className="hidden md:block w-px bg-slate-100 my-2"></div>

            <div className="p-1 md:w-48">
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
