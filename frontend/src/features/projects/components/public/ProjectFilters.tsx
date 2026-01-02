import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { Category } from '@/features/categories/api/categoriesApi';

interface PublicProjectFiltersProps {
    categories: Category[];
    selectedCategory: string;
    onCategoryChange: (id: string) => void;
    search: string;
    onSearchChange: (val: string) => void;
}

export const ProjectFilters: React.FC<PublicProjectFiltersProps> = ({
    categories,
    selectedCategory,
    onCategoryChange,
    search,
    onSearchChange,
}) => {
    return (
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <button
                    onClick={() => onCategoryChange('')}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all border ${
                        selectedCategory === ''
                            ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-600/20'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:text-orange-600'
                    }`}
                >
                    Todos
                </button>
                {categories?.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => onCategoryChange(String(cat.id))}
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all border ${
                            selectedCategory === String(cat.id)
                                ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-600/20'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:text-orange-600'
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            <div className="relative w-full lg:w-72 group">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Buscar proyecto..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-medium"
                />
            </div>
        </div>
    );
};
