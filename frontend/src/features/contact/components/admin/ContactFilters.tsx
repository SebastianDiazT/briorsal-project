import React from 'react';
import { FaSearch, FaTimes, FaFilter, FaSortAmountDown } from 'react-icons/fa';
import { CustomSelect } from '@/components/ui/CustomSelect';

interface ContactFiltersProps {
    searchTerm: string;
    onSearchChange: (val: string) => void;
    filterStatus: string;
    onStatusChange: (val: string) => void;
    pageSize: number;
    onPageSizeChange: (val: number) => void;
    onClear: () => void;
}

export const ContactFilters: React.FC<ContactFiltersProps> = ({
    searchTerm,
    onSearchChange,
    filterStatus,
    onStatusChange,
    pageSize,
    onPageSizeChange,
    onClear,
}) => {
    const statusOptions = [
        { value: 'all', label: 'Todos los mensajes' },
        { value: 'unread', label: 'No Leídos (Nuevos)' },
        { value: 'read', label: 'Leídos (Histórico)' },
    ];

    const sizeOptions = [
        { value: 5, label: '5 por página' },
        { value: 10, label: '10 por página' },
        { value: 20, label: '20 por página' },
        { value: 50, label: '50 por página' },
        { value: -1, label: 'Mostrar todo' },
    ];

    return (
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col xl:flex-row gap-3 relative z-20">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 p-1">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <FaSearch
                            className={`transition-colors ${searchTerm ? 'text-orange-500' : 'text-slate-400'}`}
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full h-[42px] bg-white border border-slate-200 rounded-xl pl-10 pr-10 text-sm font-semibold text-slate-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all placeholder-slate-400"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-red-500"
                        >
                            <FaTimes />
                        </button>
                    )}
                </div>

                <div className="flex gap-3">
                    <div className="flex-1">
                        <CustomSelect
                            value={filterStatus}
                            onChange={onStatusChange}
                            options={statusOptions}
                            placeholder="Estado"
                            icon={FaFilter}
                        />
                    </div>

                    {(searchTerm || filterStatus !== 'all') && (
                        <button
                            onClick={onClear}
                            className="h-[42px] px-4 flex items-center gap-2 bg-red-50 text-red-500 border border-red-100 rounded-xl hover:bg-red-100 transition-colors text-sm font-bold shrink-0"
                            title="Limpiar filtros"
                        >
                            <FaTimes />
                        </button>
                    )}
                </div>
            </div>

            <div className="border-t xl:border-t-0 xl:border-l border-slate-100 p-1 xl:pl-3 flex items-center justify-end xl:justify-center min-w-[160px]">
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
