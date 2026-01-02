import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { PaginationMeta } from '@/types/api';

interface PaginationFooterProps {
    meta: PaginationMeta | undefined;
    onPageChange: (page: number) => void;
    className?: string;
}

export const PaginationFooter: React.FC<PaginationFooterProps> = ({
    meta,
    onPageChange,
    className = '',
}) => {
    if (!meta || meta.total_records === 0) return null;

    const handlePrevious = () => {
        if (meta.previous) {
            onPageChange(meta.page - 1);
        }
    };

    const handleNext = () => {
        if (meta.next) {
            onPageChange(meta.page + 1);
        }
    };

    return (
        <div
            className={`mt-4 bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in ${className}`}
        >
            <div className="text-xs text-slate-500 font-medium">
                Mostrando página{' '}
                <span className="font-bold text-slate-700">{meta.page}</span> de{' '}
                <span className="font-bold text-slate-700">
                    {meta.total_pages}
                </span>{' '}
                ({meta.total_records} resultados)
            </div>

            <div className="flex gap-2">
                <button
                    onClick={handlePrevious}
                    disabled={!meta.previous}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-600 transition-all hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-600 disabled:hover:border-slate-300"
                >
                    <FaChevronLeft size={12} /> Anterior
                </button>

                <button
                    onClick={handleNext}
                    disabled={!meta.next}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-600 transition-all hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-600 disabled:hover:border-slate-300"
                >
                    Siguiente <FaChevronRight size={12} />
                </button>
            </div>
        </div>
    );
};
