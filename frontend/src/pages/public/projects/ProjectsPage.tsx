import { useState, useEffect } from 'react';
import {
    FaSpinner,
    FaArrowLeft,
    FaArrowRight,
    FaBuilding,
} from 'react-icons/fa';

import { useGetProjectsQuery } from '@features/projects/api/projectsApi';
import { useGetCategoriesQuery } from '@features/categories/api/categoriesApi';
import { ProjectCard } from '@features/projects/components/public/ProjectCard';
import { ProjectFilters } from '@features/projects/components/public/ProjectFilters';
import heroBgImg from '@assets/projects/hero.png';

export const ProjectsPage = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 9;

    const { data: categories = [] } = useGetCategoriesQuery();
    const {
        data: response,
        isLoading,
        isFetching,
    } = useGetProjectsQuery({
        page,
        pageSize: PAGE_SIZE,
        category: selectedCategory,
        search,
    });

    const projects = response?.data || [];
    const meta = response?.meta;

    useEffect(() => {
        setPage(1);
    }, [selectedCategory, search]);

    const scrollToGrid = () => {
        const gridElement = document.getElementById('projects-grid');
        if (gridElement) {
            const yCoordinate =
                gridElement.getBoundingClientRect().top + window.scrollY - 120;
            window.scrollTo({ top: yCoordinate, behavior: 'smooth' });
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        scrollToGrid();
    };

    const showPagination = meta && projects.length > 0 && meta.total_pages > 1;

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="relative h-[55vh] min-h-[450px] w-full flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed z-0 opacity-80"
                    style={{ backgroundImage: `url(${heroBgImg})` }}
                />

                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/50 to-gray-100 z-10" />

                <div className="relative z-20 text-center px-4 max-w-5xl mx-auto animate-fade-in-up mt-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest mb-6 shadow-xl">
                        <FaBuilding className="text-brand-400" /> Portafolio
                        Oficial
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
                        Nuestros{' '}
                        <span className="text-brand-500">Proyectos</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-100 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md opacity-90">
                        Explora nuestra colección de obras arquitectónicas,
                        diseños residenciales y construcciones comerciales.
                    </p>
                </div>
            </div>

            <div
                id="projects-grid"
                className="container mx-auto px-4 pb-20 relative z-30 -mt-20"
            >
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-white/50 p-6 md:p-10 min-h-[600px]">
                    <ProjectFilters
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        search={search}
                        onSearchChange={setSearch}
                    />

                    {isLoading || isFetching ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4 text-slate-400 animate-pulse">
                            <FaSpinner className="animate-spin text-4xl text-brand-500" />
                            <p className="text-sm font-medium">
                                Cargando portafolio...
                            </p>
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                                {projects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                    />
                                ))}
                            </div>

                            {projects.length === 0 && (
                                <div className="text-center py-24 bg-gray-100 rounded-3xl border-2 border-dashed border-gray-200">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 shadow-sm border border-gray-50">
                                        <FaBuilding className="text-3xl" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-700 mb-2">
                                        Sin resultados
                                    </h3>
                                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                                        No encontramos proyectos que coincidan
                                        con tu búsqueda actual.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSearch('');
                                            setSelectedCategory('');
                                        }}
                                        className="text-brand-600 font-bold hover:text-brand-700 transition-colors underline decoration-2 underline-offset-4"
                                    >
                                        Ver todos los proyectos
                                    </button>
                                </div>
                            )}

                            {showPagination && meta && (
                                <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-100 pt-10 gap-6">
                                    <span className="text-sm text-gray-500 font-medium order-2 md:order-1">
                                        Página{' '}
                                        <span className="text-gray-900 font-bold">
                                            {page}
                                        </span>{' '}
                                        de{' '}
                                        <span className="text-gray-900 font-bold">
                                            {meta.total_pages}
                                        </span>
                                    </span>

                                    <div className="flex items-center gap-2 order-1 md:order-2">
                                        <button
                                            onClick={() =>
                                                handlePageChange(page - 1)
                                            }
                                            disabled={page === 1}
                                            className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 text-gray-600 font-bold text-sm transition-all hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600 disabled:hover:border-gray-200"
                                        >
                                            <FaArrowLeft size={12} /> Anterior
                                        </button>

                                        <div className="hidden md:flex gap-1 mx-2">
                                            {Array.from(
                                                { length: meta.total_pages },
                                                (_, i) => i + 1
                                            ).map((p) => (
                                                <button
                                                    key={p}
                                                    onClick={() =>
                                                        handlePageChange(p)
                                                    }
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                                        page === p
                                                            ? 'bg-brand-600 text-white shadow-lg scale-110'
                                                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                                    }`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() =>
                                                handlePageChange(page + 1)
                                            }
                                            disabled={page >= meta.total_pages}
                                            className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 text-gray-600 font-bold text-sm transition-all hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600 disabled:hover:border-gray-200"
                                        >
                                            Siguiente <FaArrowRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
